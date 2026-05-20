import { createClient } from "@/lib/config/server";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const { ticketId } = await req.json();

        if (!ticketId) {
            return NextResponse.json(
                { message: "Billet manquant" },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const { data: existingTicket } = await supabase
            .from("guest_groups")
            .select("id, checked_in_at")
            .eq("id", ticketId)
            .single();

        if (!existingTicket) {
            return NextResponse.json(
                { message: "Billet introuvable" },
                { status: 404 }
            );
        }

        if (existingTicket.checked_in_at) {
            return NextResponse.json(
                { message: "Ce billet a déjà été utilisé" },
                { status: 409 }
            );
        }

        const { data, error } = await supabase
            .from("guest_groups")
            .update({
                checked_in_at: new Date().toISOString(),
            })
            .eq("id", ticketId)
            .select(`
        id,
        name,
        max_guests,
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
                { message: "Erreur lors de la validation" },
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