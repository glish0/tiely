import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TicketVerification = {
    id: string;
    name: string;
    max_guests: number;
    group_type: "single" | "couple";
    table_number: number | null;
    rsvp_status: "pending" | "confirmed" | "declined";
    rsvp_confirmed_at: string | null;
    checked_in_at: string | null;
    qr_token: string;
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