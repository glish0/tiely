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
            .select(`
    id,
    group_type,
    checked_in_at,
    scanned_count,
    max_guests
  `)
            .eq("id", ticketId)
            .single();

        if (!existingTicket) {
            return NextResponse.json(
                { message: "Billet introuvable" },
                { status: 404 }
            );
        }

        if (
            existingTicket.group_type !== "family" &&
            existingTicket.checked_in_at
        ) {
            return NextResponse.json(
                { message: "Ce billet a déjà été utilisé" },
                { status: 409 }
            );
        }

        const updateData: Record<string, unknown> = {};

        if (existingTicket.group_type === "family") {
            updateData.scanned_count =
                (existingTicket.scanned_count ?? 0) + 1;
        } else {
            updateData.checked_in_at = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from("guest_groups")
            .update(updateData)
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
      scanned_count,
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