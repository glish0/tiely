import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TicketVerificationTicket = {
    id: string;
    wedding_id: string;
    name: string;
    group_type: "single" | "couple";
    max_guests: number;
    table_number: number | null;
    rsvp_status: "pending" | "confirmed" | "declined";
    checked_in_at: string | null;
    invitation_slug: string | null;
};

export type TicketVerification = {
    valid: boolean;
    ticket: TicketVerificationTicket | null;
};

async function verifyTicket(token: string): Promise<TicketVerification> {
    const res = await fetch(`/api/tickets/verify/${token}`);

    if (!res.ok) {
        throw new Error("Billet invalide");
    }

    return res.json();
}

async function checkInTicket(ticketId: string): Promise<TicketVerification> {
    const res = await fetch("/api/tickets/check-in", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketId }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Impossible de valider l’entrée");
    }

    return res.json();
}

export function useVerifyTicket(token: string) {
    return useQuery({
        queryKey: ["ticket-verification", token],
        queryFn: () => verifyTicket(token),
        enabled: Boolean(token),
        refetchInterval: 5000,
    });
}

export function useCheckInTicket(token: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: checkInTicket,
        onSuccess: (updatedTicket) => {
            queryClient.setQueryData(
                ["ticket-verification", token],
                updatedTicket
            );
        },
    });
}