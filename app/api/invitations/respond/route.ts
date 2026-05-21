import { NextResponse } from "next/server";
import { createClient } from "@/lib/config/server";

export async function POST(request: Request) {
    const supabase = await createClient();

    const body = await request.json();

    const invitationId = body.invitationId as string;
    const status = body.status as "confirmed" | "declined";

    if (!invitationId || !status) {
        return NextResponse.json(
            { message: "Invitation ou statut manquant." },
            { status: 400 }
        );
    }

    if (!["confirmed", "declined"].includes(status)) {
        return NextResponse.json(
            { message: "Statut invalide." },
            { status: 400 }
        );
    }

    const { data, error } = await supabase
        .from("guest_groups")
        .update({
            rsvp_status: status,
            rsvp_confirmed_at: new Date().toISOString(),
        })
        .eq("id", invitationId)
        .select("*")
        .single();

    if (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json(data);
}