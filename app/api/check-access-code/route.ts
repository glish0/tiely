import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { code } = await req.json();

        if (!code) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Code requis",
                },
                { status: 400 }
            );
        }

        if (code !== process.env.CHECKIN_ACCESS_CODE) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Code incorrect",
                },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Erreur serveur",
            },
            { status: 500 }
        );
    }
}