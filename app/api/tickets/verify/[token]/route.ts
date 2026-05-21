import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/config/server";

type RouteContext = {
    params: Promise<{
        token: string;
    }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
    const { token } = await params;

    if (!token) {
        return NextResponse.json(
            { message: "Token manquant." },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    const { data: ticket, error } = await supabase
        .from("guest_groups")
        .select(`
      id,
      wedding_id,
      name,
      group_type,
      max_guests,
      table_number,
      rsvp_status,
      checked_in_at,
      qr_token,
      invitation_slug,
      weddings (
        id,
        groom,
        bride,
        event_date
      )
    `)
        .eq("qr_token", token)
        .maybeSingle();

    if (error) {
        console.error("VERIFY TICKET ERROR:", error);

        return NextResponse.json(
            {
                message: "Erreur lors de la vérification du ticket.",
                error: error.message,
                details: error.details,
                hint: error.hint,
            },
            { status: 500 }
        );
    }

    if (!ticket) {
        return NextResponse.json(
            {
                valid: false,
                message: "Ticket introuvable ou invalide.",
            },
            { status: 404 }
        );
    }

    return NextResponse.json({
        valid: true,
        ticket,
    });
}