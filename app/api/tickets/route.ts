import { NextResponse } from "next/server";
import { createClient } from "@/lib/config/server";

export async function GET() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("guest_groups")
        .select(`
      id,
      wedding_id,
      name,
      invitation_slug,
      max_guests,
      group_type,
      table_number,
      rsvp_status,
      checked_in_at,
      qr_token,
      weddings (
        id,
        groom,
        bride
      )
    `)
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json(
            {
                message: "Erreur lors du chargement des tickets",
                error: error.message,
            },
            { status: 500 }
        );
    }

    return NextResponse.json(data ?? []);
}