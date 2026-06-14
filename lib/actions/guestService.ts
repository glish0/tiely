import {
  CheckInResult,
  CreateGuestGroupInput,

  GuestGroupInterface,
  GuestGroupWithGuests,
  GuestWithWedding,
  ICreateGuestGroup,
  InvitationChannel,
  InvitationDetails,
  RsvpResponse,
  SubmitRsvpInput,
  UserWeddingOption,
} from "@/types";
import { ensureFreshSession, supabase } from "../config/supabase";

export type CreateGuestPersonInput = {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  is_child?: boolean;
};

export type CreateGuestInput = {
  wedding_id: string;
  group_type: "single" | "couple";
  table_number: number | null;
  guests: CreateGuestPersonInput[];
};

type GuestWedding = NonNullable<GuestWithWedding["weddings"]>;
type RawGuestWithWedding = Omit<GuestWithWedding, "weddings"> & {
  weddings?: GuestWedding | GuestWedding[] | null;
};
type RawGuestGroupWithGuests = Omit<GuestGroupWithGuests, "weddings"> & {
  weddings?: GuestWedding | GuestWedding[] | null;
};

const groupGuestsByGuestGroupId = (guests: GuestWithWedding[]) => {
  return guests.reduce<Map<string, GuestWithWedding[]>>((acc, guest) => {
    if (!guest.guest_group_id) {
      return acc;
    }

    const currentGuests = acc.get(guest.guest_group_id) ?? [];
    currentGuests.push(guest);
    acc.set(guest.guest_group_id, currentGuests);

    return acc;
  }, new Map<string, GuestWithWedding[]>());
};

const generateGuestQrToken = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
};

export const getUserWeddingOptions = async (): Promise<UserWeddingOption[]> => {
  const session = await ensureFreshSession();

  const { data, error } = await supabase
    .from("weddings")
    .select("id, groom, bride, event_date")
    .eq("user_id", session.user.id)
    .order("event_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }


  return data ?? [];
};

export const getGuestsForCurrentUser = async (): Promise<GuestWithWedding[]> => {
  const weddings = await getUserWeddingOptions();
  const weddingIds = weddings.map((wedding) => wedding.id);

  if (!weddingIds.length) {
    return [];
  }

  const { data, error } = await supabase
    .from("guests")
    .select(`*, weddings (*)`)
    .in("wedding_id", weddingIds)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const guests = (data ?? []) as unknown as RawGuestWithWedding[];

  return guests.map((guest) => ({
    ...guest,
    weddings: Array.isArray(guest.weddings)
      ? guest.weddings[0] ?? null
      : guest.weddings ?? null,
  }));
};

/* export const getGuestGroupsForCurrentUser = async () => {
  const weddings = await getUserWeddingOptions();
  const weddingIds = weddings.map((w) => w.id);

  if (!weddingIds.length) return [];

  const { data, error } = await supabase
    .from("guest_groups")
    .select("*")
    /* .in("wedding_id", weddingIds) 
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data ?? [];
}; */

export const getGuestGroupsForCurrentUser = async (): Promise<GuestGroupWithGuests[]> => {
  const weddings = await getUserWeddingOptions();
  const weddingIds = weddings.map((w) => w.id);

  if (!weddingIds.length) return [];

  const { data, error } = await supabase
    .from("guest_groups")
    .select(`
      *,
      weddings (
        id,
        groom,
        bride
      ),
      guests (*)
    `)
    .in("wedding_id", weddingIds)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((group) => ({
    ...group,
    guests: group.guests ?? [],
    rsvp_response: null,
  })) as GuestGroupWithGuests[];
};

export const createGuest = async (payload: CreateGuestInput) => {
  const session = await ensureFreshSession();
  const userId = session.user.id;

  const guestsToCreate = payload.guests;
  const guestsToAdd = guestsToCreate.length;

  const { data: activePlan, error: planError } = await supabase
    .from("user_active_plan")
    .select("max_guests")
    .eq("user_id", userId)
    .single();

  if (planError || !activePlan) {
    throw new Error("Aucun plan actif trouvé pour votre compte.");
  }

  const { count: currentGuests, error: countError } = await supabase
    .from("guests")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) {
    throw new Error(countError.message);
  }

  if ((currentGuests || 0) + guestsToAdd > activePlan.max_guests) {
    throw new Error(
      `Limite atteinte. Votre plan autorise ${activePlan.max_guests} invité(s).`
    );
  }

  const { data: wedding, error: weddingError } = await supabase
    .from("weddings")
    .select("id")
    .eq("id", payload.wedding_id)
    .eq("user_id", userId)
    .single();

  if (weddingError || !wedding) {
    throw new Error("Ce mariage est introuvable pour votre compte.");
  }

  const groupName = guestsToCreate
    .map((guest) => `${guest.first_name} ${guest.last_name}`.trim())
    .join(" & ");

  const { data: group, error: groupError } = await supabase
    .from("guest_groups")
    .insert({
      wedding_id: payload.wedding_id,
      user_id: userId,
      name: groupName,
      group_type: payload.group_type,
      max_guests: payload.group_type === "couple" ? 2 : 1,
      table_number: payload.table_number,
      invitation_slug: crypto.randomUUID(),
      qr_token: crypto.randomUUID(),
      rsvp_status: "pending",
      checked_in_at: null,
    })
    .select("*")
    .single();

  if (groupError || !group) {
    throw new Error(groupError?.message || "Erreur création du groupe invité.");
  }

  const guestsPayload = guestsToCreate.map((guest) => ({
    wedding_id: payload.wedding_id,
    group_id: group.id,
    user_id: userId,
    first_name: guest.first_name,
    last_name: guest.last_name,
    email: guest.email || null,
    phone: guest.phone || null,
    is_child: guest.is_child ?? false,
  }));

  const { error: guestsError } = await supabase
    .from("guests")
    .insert(guestsPayload);

  if (guestsError) {
    throw new Error(guestsError.message);
  }

  return group;
};

const buildGuestGroupName = (payload: ICreateGuestGroup) => {
  const [firstGuest, secondGuest] = payload.guests;

  if (!firstGuest) return "Groupe sans nom";

  if (payload.group_type === "couple" && secondGuest) {
    return `${firstGuest.first_name} ${firstGuest.last_name} & ${secondGuest.first_name} ${secondGuest.last_name}`;
  }

  return `${firstGuest.first_name} ${firstGuest.last_name}`;
};

export const createGuestGroupWithGuests = async (
  payload: ICreateGuestGroup
): Promise<GuestGroupWithGuests> => {
  const session = await ensureFreshSession();

  const expectedGuestCount = payload.group_type === "couple" ? 2 : 1;
  const guests = payload.guests.slice(0, expectedGuestCount).map((guest) => ({
    ...guest,
    first_name: guest.first_name.trim(),
    last_name: guest.last_name.trim(),
    email: guest.email?.trim() ?? "",
    phone: guest.phone?.trim() ?? "",
  }));

  if (guests.length !== expectedGuestCount) {
    throw new Error(
      payload.group_type === "couple"
        ? "Un couple doit contenir deux invités."
        : "Un invité simple doit contenir une personne."
    );
  }

  if (guests.some((guest) => !guest.first_name || !guest.last_name)) {
    throw new Error("Le prénom et le nom sont obligatoires pour chaque invité.");
  }

  const { data: wedding, error: weddingError } = await supabase
    .from("weddings")
    .select("id")
    .eq("id", payload.wedding_id)
    .eq("user_id", session.user.id)
    .single();

  if (weddingError) {
    throw new Error(weddingError.message);
  }

  if (!wedding) {
    throw new Error("Ce mariage est introuvable pour votre compte.");
  }

  const invitationToken = generateGuestQrToken();
  console.log('GENERATE QR CODE', invitationToken)

  const { data: group, error: groupError } = await supabase
    .from("guest_groups")
    .insert({
      wedding_id: payload.wedding_id,
      name: buildGuestGroupName({ ...payload, guests }),
      invitation_slug: invitationToken,
      qr_token: invitationToken,
      group_type: payload.group_type,
      max_guests: expectedGuestCount,
      plus_one_allowed: false,
      table_number: payload.table_number ?? null,
    })
    .select()
    .single();

  console.log('GROUP DATA', group)


  if (groupError) {
    throw new Error(groupError.message);
  }

  const { data: insertedGuests, error: guestsError } = await supabase
    .from("guests")
    .insert(
      guests.map((guest) => ({
        wedding_id: payload.wedding_id,
        guest_group_id: group.id,
        first_name: guest.first_name,
        last_name: guest.last_name,
        email: guest.email,
        phone: guest.phone,
        is_child: guest.is_child,
        qr_code_token: invitationToken,
        status: "invited",
        checked_in_at: null,
      }))
    )
    .select();

  if (guestsError) {
    await supabase.from("guest_groups").delete().eq("id", group.id);
    throw new Error(guestsError.message);
  }

  return {
    ...group,
    guests: (insertedGuests ?? []) as GuestWithWedding[],
    rsvp_response: null,
  } as GuestGroupWithGuests;
};

// mise a jour du billet

export const updateGuestGroupWithGuests = async (
  groupId: string,
  payload: ICreateGuestGroup
): Promise<GuestGroupWithGuests> => {
  const session = await ensureFreshSession();

  const expectedGuestCount = payload.group_type === "couple" ? 2 : 1;

  const guests = payload.guests.slice(0, expectedGuestCount).map((guest) => ({
    ...guest,
    first_name: guest.first_name.trim(),
    last_name: guest.last_name.trim(),
    email: guest.email?.trim() ?? "",
    phone: guest.phone?.trim() ?? "",
  }));

  if (guests.length !== expectedGuestCount) {
    throw new Error(
      payload.group_type === "couple"
        ? "Un couple doit contenir deux invités."
        : "Un invité simple doit contenir une personne."
    );
  }

  if (guests.some((guest) => !guest.first_name || !guest.last_name)) {
    throw new Error("Le prénom et le nom sont obligatoires pour chaque invité.");
  }

  const { data: wedding, error: weddingError } = await supabase
    .from("weddings")
    .select("id")
    .eq("id", payload.wedding_id)
    .eq("user_id", session.user.id)
    .single();

  if (weddingError) {
    throw new Error(weddingError.message);
  }

  if (!wedding) {
    throw new Error("Ce mariage est introuvable pour votre compte.");
  }

  const { data: existingGroup, error: existingGroupError } = await supabase
    .from("guest_groups")
    .select("*")
    .eq("id", groupId)
    .eq("wedding_id", payload.wedding_id)
    .single();

  if (existingGroupError) {
    throw new Error(existingGroupError.message);
  }

  if (!existingGroup) {
    throw new Error("Ce groupe d'invités est introuvable.");
  }

  const invitationToken =
    existingGroup.invitation_slug || generateGuestQrToken();

  const { data: updatedGroup, error: groupError } = await supabase
    .from("guest_groups")
    .update({
      name: buildGuestGroupName({ ...payload, guests }),
      invitation_slug: invitationToken,
      group_type: payload.group_type,
      max_guests: expectedGuestCount,
      plus_one_allowed: false,
      table_number: payload.table_number ?? null,
    })
    .eq("id", groupId)
    .eq("wedding_id", payload.wedding_id)
    .select()
    .single();

  if (groupError) {
    throw new Error(groupError.message);
  }

  const { error: deleteGuestsError } = await supabase
    .from("guests")
    .delete()
    .eq("guest_group_id", groupId)
    .eq("wedding_id", payload.wedding_id);

  if (deleteGuestsError) {
    throw new Error(deleteGuestsError.message);
  }

  const { data: insertedGuests, error: guestsError } = await supabase
    .from("guests")
    .insert(
      guests.map((guest) => ({
        wedding_id: payload.wedding_id,
        guest_group_id: groupId,
        first_name: guest.first_name,
        last_name: guest.last_name,
        email: guest.email,
        phone: guest.phone,
        is_child: guest.is_child,
        qr_code_token: invitationToken,
        status: "invited",
        checked_in_at: null,
      }))
    )
    .select();

  if (guestsError) {
    throw new Error(guestsError.message);
  }

  return {
    ...updatedGroup,
    guests: (insertedGuests ?? []) as GuestWithWedding[],
    rsvp_response: null,
  } as GuestGroupWithGuests;
};

export const getGuestGroupsWithGuests = async (
  weddingId: string
): Promise<GuestGroupWithGuests[]> => {
  const { data, error } = await supabase
    .from("guest_groups")
    .select(`
      *,
      guests (*),
      rsvp_response:rsvp_responses (*)
    `)
    .eq("wedding_id", weddingId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as GuestGroupWithGuests[];
};

export const getInvitationBySlug = async (
  invitation_slug: string
): Promise<InvitationDetails | null> => {
  const { data, error } = await supabase
    .from("guest_groups")
    .select("*,weddings(*)")
    .eq("invitation_slug", invitation_slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const group = data as unknown as Omit<InvitationDetails, "wedding" | "rsvp_response"> & {
    weddings?: InvitationDetails["wedding"] | InvitationDetails["wedding"][] | null;
  };

  console.log('group', group)

  const { data: guests, error: guestsError } = await supabase
    .from("guests")
    .select("*")
    .eq("guest_group_id", group.id);

  if (guestsError) {
    throw new Error(guestsError.message);
  }

  const { data: responses, error: responseError } = await supabase
    .from("rsvp_response")
    .select("*")
    .eq("invitation_id", group.id)
    .order("responded_at", { ascending: false })
    .limit(1);

  if (responseError) {
    throw new Error(responseError.message);
  }

  return {
    ...group,
    wedding: Array.isArray(group.weddings)
      ? group.weddings[0] ?? null
      : group.weddings ?? null,
    guests: (guests ?? []) as GuestWithWedding[],
    rsvp_response: ((responses ?? [])[0] as RsvpResponse | undefined) ?? null,
  };
};

export const submitRsvpResponse = async (payload: SubmitRsvpInput) => {
  const responsePayload = {
    invitation_id: payload.invitation_id,
    attending: payload.attending,
    dietary_restrictions: payload.dietary_restrictions?.trim() || null,
    message: payload.message?.trim() || null,
    responded_at: new Date().toISOString(),
  };

  const { data: existing, error: existingError } = await supabase
    .from("rsvp_response")
    .select("id")
    .eq("invitation_id", payload.invitation_id)
    .order("responded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existing) {
    const { data, error } = await supabase
      .from("rsvp_response")
      .update(responsePayload)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as RsvpResponse;
  }

  const { data, error } = await supabase
    .from("rsvp_response")
    .insert(responsePayload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as RsvpResponse;
};

export const markInvitationAsSent = async ({
  invitationId,
  channel = "manual",
}: {
  invitationId: string;
  channel?: InvitationChannel;
}) => {
  await ensureFreshSession();
  const weddings = await getUserWeddingOptions();
  const weddingIds = weddings.map((wedding) => wedding.id);

  if (!weddingIds.length) {
    throw new Error("Aucun mariage trouve pour votre compte.");
  }

  const { data: group, error: groupError } = await supabase
    .from("guest_groups")
    .select("id, wedding_id")
    .eq("id", invitationId)
    .in("wedding_id", weddingIds)
    .single();

  if (groupError) {
    throw new Error(groupError.message);
  }

  if (!group) {
    throw new Error("Invitation introuvable pour votre compte.");
  }

  const { data, error } = await supabase
    .from("guest_groups")
    .update({
      invitation_status: "sent",
      invitation_sent_at: new Date().toISOString(),
      invitation_channel: channel,
      invitation_error: null,
    })
    .eq("id", invitationId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as GuestGroupWithGuests;
};

export const markAllInvitationsAsSent = async ({
  channel = "manual",
}: {
  channel?: InvitationChannel;
} = {}) => {
  await ensureFreshSession();
  const weddings = await getUserWeddingOptions();
  const weddingIds = weddings.map((wedding) => wedding.id);

  if (!weddingIds.length) {
    return [];
  }

  const { data, error } = await supabase
    .from("guest_groups")
    .update({
      invitation_status: "sent",
      invitation_sent_at: new Date().toISOString(),
      invitation_channel: channel,
      invitation_error: null,
    })
    .in("wedding_id", weddingIds)
    .not("invitation_slug", "is", null)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const createGuestGroup = async (payload: GuestGroupInterface) => {

  const { data, error: weddingError } = await supabase
    .from("guest_groups")
    .insert([payload])
    .select()

    .single();

  if (weddingError) {
    throw new Error(weddingError.message);
  }



  return data;
};

export const checkInGuestByQrToken = async (
  qr_code_token: string
): Promise<CheckInResult> => {
  await ensureFreshSession();

  const { data: group, error: groupError } = await supabase
    .from("guest_groups")
    .select(
      `
        *,
        guests (
          *,
          weddings (
            id,
            groom,
            bride,
            event_date,
            venue,
            slug,
            template_id
          )
        )
      `
    )
    .eq("invitation_slug", qr_code_token)
    .maybeSingle();

  if (groupError) {
    throw new Error(groupError.message);
  }

  if (group) {
    const guests = (group.guests ?? []) as GuestWithWedding[];
    const alreadyCheckedIn = guests.length > 0 && guests.every((guest) => guest.checked_in_at);

    if (alreadyCheckedIn) {
      return {
        status: "already-checked-in",
        guest: group,
      };
    }

    const { data: checkedInGuests, error: checkInGroupError } = await supabase
      .from("guests")
      .update({
        status: "checked-in",
        checked_in_at: new Date().toISOString(),
      })
      .eq("guest_group_id", group.id)
      .select(
        `
          *,
          weddings (
            id,
            groom,
            bride,
            event_date,
            venue,
            slug,
            template_id
          )
        `
      );

    if (checkInGroupError) {
      throw new Error(checkInGroupError.message);
    }

    return {
      status: "checked-in",
      guest: {
        ...group,
        guests: checkedInGuests ?? [],
      },
    };
  }

  const { data: guest, error: guestError } = await supabase
    .from("guests")
    .select(
      `
        *,
        weddings (
          id,
          groom,
          bride,
          event_date,
          venue,
          slug,
          template_id
        )
      `
    )
    .eq("qr_code_token", qr_code_token)
    .single();

  if (guestError) {
    throw new Error(guestError.message);
  }

  if (guest.checked_in_at) {
    return {
      status: "already-checked-in",
      guest,
    };
  }

  const { data: checkedInGuest, error: checkInError } = await supabase
    .from("guests")
    .update({
      status: "checked-in",
      checked_in_at: new Date().toISOString(),
    })
    .eq("id", guest.id)
    .select(
      `
        *,
        weddings (
          id,
          groom,
          bride,
          event_date,
          venue,
          slug,
          template_id
        )
      `
    )
    .single();

  if (checkInError) {
    throw new Error(checkInError.message);
  }

  return {
    status: "checked-in",
    guest: checkedInGuest,
  };
};


export const deleteGuestGroupWithGuests = async (
  groupId: string
): Promise<void> => {
  const session = await ensureFreshSession();

  const { data: group, error: groupError } = await supabase
    .from("guest_groups")
    .select(`
      id,
      wedding_id,
      weddings (
        id,
        user_id
      )
    `)
    .eq("id", groupId)
    .single();

  if (groupError) {
    throw new Error(groupError.message);
  }

  if (!group) {
    throw new Error("Groupe invité introuvable.");
  }

  const wedding = Array.isArray(group.weddings)
    ? group.weddings[0]
    : group.weddings;

  if (!wedding || wedding.user_id !== session.user.id) {
    throw new Error("Vous n'êtes pas autorisé à supprimer cet invité.");
  }

  const { error: guestsError } = await supabase
    .from("guests")
    .delete()
    .eq("guest_group_id", groupId);

  if (guestsError) {
    throw new Error(guestsError.message);
  }

  const { error: deleteGroupError } = await supabase
    .from("guest_groups")
    .delete()
    .eq("id", groupId);

  if (deleteGroupError) {
    throw new Error(deleteGroupError.message);
  }
};
