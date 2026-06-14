import { notFound } from "next/navigation";
import { InvitationClient } from "./InvitationClient";
import { createClient } from "@/lib/config/server";
import { Metadata } from "next";


type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: RouteContext): Promise<Metadata> {
  const { slug } = await params;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tiely.vercel.app";

  return {
    title: "Invitation de mariage - Ghislaine & Sosthène",
    description:
      "Vous êtes invité(e) au mariage de Ghislaine & Sosthène. Ouvrez votre invitation personnalisée, confirmez votre présence et téléchargez votre billet.",
    openGraph: {
      title: "Invitation de mariage - Ghislaine & Sosthène",
      description:
        "Ouvrez votre invitation personnalisée, confirmez votre présence et téléchargez votre billet avec QR Code.",
      url: `${siteUrl}/invitation/${slug}`,
      siteName: "Tiely",
      images: [
        {
          url: `${siteUrl}/images/wedding-preview.jpg`,
          width: 1200,
          height: 630,
          alt: "Invitation de mariage Ghislaine & Sosthène",
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Invitation de mariage - Ghislaine & Sosthène",
      description:
        "Ouvrez votre invitation personnalisée et téléchargez votre billet avec QR Code.",
      images: [`${siteUrl}/images/wedding-preview.jpg`],
    },
  };
}

export default async function InvitationPage({ params }: RouteContext) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: invitation, error } = await supabase
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

  if (error || !invitation) {
    notFound();
  }

  console.log('INVITATION LINK', invitation)

  return <InvitationClient invitation={invitation} />;
}




