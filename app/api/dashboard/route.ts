import { NextResponse } from "next/server";
import { createClient } from "@/lib/config/server";

export async function GET() {
    const supabase = await createClient();

    const { count: totalGuests, error: guestsError } = await supabase
        .from("guests")
        .select("*", { count: "exact", head: true });

    const { count: totalGuestGroups, error: groupsError } = await supabase
        .from("guest_groups")
        .select("*", { count: "exact", head: true });

    const { count: confirmedGroups, error: confirmedError } = await supabase
        .from("guest_groups")
        .select("*", { count: "exact", head: true })
        .eq("rsvp_status", "confirmed");

    const { count: checkedInGroups, error: checkedInError } = await supabase
        .from("guest_groups")
        .select("*", { count: "exact", head: true })
        .not("checked_in_at", "is", null);

    const { count: totalWeddings, error: weddingsError } = await supabase
        .from("weddings")
        .select("*", { count: "exact", head: true });

    if (
        guestsError ||
        groupsError ||
        confirmedError ||
        checkedInError ||
        weddingsError
    ) {
        return NextResponse.json(
            {
                message: "Erreur lors du chargement du dashboard",
                error:
                    guestsError?.message ||
                    groupsError?.message ||
                    confirmedError?.message ||
                    checkedInError?.message ||
                    weddingsError?.message,
            },
            { status: 500 }
        );
    }

    const safeTotalGroups = totalGuestGroups || 0;
    const safeConfirmedGroups = confirmedGroups || 0;

    const attendanceRate =
        safeTotalGroups > 0
            ? Math.round((safeConfirmedGroups / safeTotalGroups) * 100)
            : 0;

    return NextResponse.json({
        totalGuests: totalGuests || 0,
        totalGuestGroups: totalGuestGroups || 0,
        confirmedGroups: confirmedGroups || 0,
        checkedInGroups: checkedInGroups || 0,
        totalWeddings: totalWeddings || 0,
        attendanceRate,
    });
}