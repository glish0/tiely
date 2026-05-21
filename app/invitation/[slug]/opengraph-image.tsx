import { ImageResponse } from "next/og";
import { createClient } from "@/lib/config/server";

export const alt = "Invitation de mariage";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function Image({ params }: Props) {
    const { slug } = await params;

    const supabase = await createClient();

    const { data: invitation } = await supabase
        .from("guest_groups")
        .select(`
      id,
      name,
      group_type,
      max_guests,
      table_number,
      invitation_slug
    `)
        .eq("invitation_slug", slug)
        .single();

    const guestName = invitation
        ? formatGuestName(invitation.name, invitation.group_type)
        : "INVITÉ(E)";

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                        "linear-gradient(135deg, #fffdf7 0%, #fff6e6 45%, #f4dfb2 100%)",
                    padding: "50px",
                    fontFamily: "Arial",
                }}
            >
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        border: "2px solid #d6a93d",
                        borderRadius: "42px",
                        background: "rgba(255,255,255,0.72)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: "-80px",
                            left: "-80px",
                            width: "260px",
                            height: "260px",
                            borderRadius: "999px",
                            background: "rgba(214,169,61,0.18)",
                        }}
                    />

                    <div
                        style={{
                            position: "absolute",
                            bottom: "-90px",
                            right: "-90px",
                            width: "300px",
                            height: "300px",
                            borderRadius: "999px",
                            background: "rgba(214,169,61,0.16)",
                        }}
                    />

                    <div
                        style={{
                            color: "#9a6a12",
                            fontSize: 28,
                            letterSpacing: "10px",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            marginBottom: 28,
                        }}
                    >
                        Invitation de mariage
                    </div>

                    <div
                        style={{
                            fontSize: 74,
                            lineHeight: 1.05,
                            fontWeight: 800,
                            color: "#6b430f",
                            marginBottom: 22,
                        }}
                    >
                        Ghislaine & Sosthène
                    </div>

                    <div
                        style={{
                            width: 180,
                            height: 2,
                            background: "#d6a93d",
                            marginBottom: 24,
                        }}
                    />

                    <div
                        style={{
                            fontSize: 34,
                            fontWeight: 700,
                            color: "#2d210f",
                            marginBottom: 14,
                        }}
                    >
                        {guestName}
                    </div>

                    <div
                        style={{
                            fontSize: 26,
                            color: "#7a5a1f",
                            fontWeight: 600,
                        }}
                    >
                        Cliquez pour ouvrir votre invitation personnalisée
                    </div>
                </div>
            </div>
        ),
        {
            width: size.width,
            height: size.height,
        }
    );
}

function formatGuestName(name: string, groupType: string) {
    const guestName = name.trim().toUpperCase();

    if (groupType === "couple") {
        return `Mr/Mme ${guestName}`;
    }

    return guestName;
}