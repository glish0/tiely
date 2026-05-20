import { createClient } from "@/lib/config/server";
import { NextResponse } from "next/server";


type RouteContext = {
    params: Promise<{
        slug: string;
    }>;
};


export async function GET(_: Request, { params }: RouteContext) {
    const supabase = await createClient();
    const { slug } = await params;

    const { data, error } = await supabase
        .from("guest_groups")
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
        .eq("invitation_slug", slug)
        .single();

    if (error || !data) {
        return NextResponse.json(
            { message: "Invitation introuvable" },
            { status: 404 }
        );
    }

    return NextResponse.json(data);
}