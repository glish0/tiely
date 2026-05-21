import { useQuery } from "@tanstack/react-query";

export type TicketItem = {
    id: string;
    wedding_id: string;
    name: string;
    invitation_slug: string;
    max_guests: number;
    group_type: "single" | "couple";
    table_number: number | null;
    rsvp_status: "pending" | "confirmed" | "declined";
    checked_in_at: string | null;
    qr_token: string;
    weddings: {
        id: string;
        groom: string;
        bride: string;
    } | null;
};

async function getTickets(): Promise<TicketItem[]> {
    const res = await fetch("/api/tickets");

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erreur lors du chargement des tickets");
    }

    return res.json();
}

export function useTickets() {
    return useQuery({
        queryKey: ["tickets"],
        queryFn: getTickets,
        refetchInterval: 10000,
    });
}