import { createClient } from "@/lib/config/server";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const { invitationId } = await req.json();

        if (!invitationId) {
            return NextResponse.json(
                { message: "Invitation manquante" },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from("guest_groups")
            .update({
                rsvp_status: "confirmed",
                rsvp_confirmed_at: new Date().toISOString(),
            })
            .eq("id", invitationId)
            .select(`
        id,
        wedding_id,
        name,
        invitation_slug,
        max_guests,
        plus_one_allowed,
        group_type,
        table_number,
        rsvp_status,
        rsvp_confirmed_at,
        checked_in_at,
        qr_token
      `)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { message: "Erreur lors de la confirmation" },
                { status: 500 }
            );
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { message: "Erreur serveur" },
            { status: 500 }
        );
    }
}