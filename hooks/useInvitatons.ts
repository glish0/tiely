import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Invitation = {
    id: string;
    wedding_id: string;
    name: string;
    invitation_slug: string;
    max_guests: number;
    plus_one_allowed: boolean;
    group_type: "single" | "couple";
    table_number: number | null;
    rsvp_status: "pending" | "confirmed" | "declined";
    rsvp_confirmed_at: string | null;
    checked_in_at: string | null;
    qr_token: string;
};

async function getInvitationBySlug(slug: string): Promise<Invitation> {
    const res = await fetch(`/api/invitations/${slug}`);

    if (!res.ok) {
        throw new Error("Invitation introuvable");
    }

    return res.json();
}

async function confirmPresence(invitationId: string): Promise<Invitation> {
    const res = await fetch("/api/invitations/confirm-presence", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ invitationId }),
    });

    if (!res.ok) {
        throw new Error("Impossible de confirmer la présence");
    }

    return res.json();
}

export function useInvitation(slug: string) {
    return useQuery({
        queryKey: ["invitation", slug],
        queryFn: () => getInvitationBySlug(slug),
        enabled: Boolean(slug),
    });
}

export function useConfirmPresence(slug: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: confirmPresence,
        onSuccess: (updatedInvitation) => {
            queryClient.setQueryData(["invitation", slug], updatedInvitation);
        },
    });
}