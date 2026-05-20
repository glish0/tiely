import { notFound } from "next/navigation";
import { InvitationClient } from "./InvitationClient";
import { createClient } from "@/lib/config/server";


type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};


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

  return <InvitationClient invitation={invitation} />;
}




