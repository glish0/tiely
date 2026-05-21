import { NextResponse } from "next/server";
import { createClient } from "@/lib/config/server";

export async function GET() {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json(
            { message: "Non authentifié" },
            { status: 401 }
        );
    }

    const { data, error } = await supabase
        .from("user_active_plan")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (error || !data) {
        return NextResponse.json(
            { message: "Aucun plan actif trouvé" },
            { status: 404 }
        );
    }

    return NextResponse.json(data);
}