
export type TProfile = {
  id: string;
  full_name: string;
  email: string;
  subscription_tier: string;
  subscription_end_date: string;
  created_at: string;
};

type DesignConfig = {
  template?: string;
  primaryColor?: string;
  secondaryColor?: string;
  font?: string;
  backgroundImage?: string;
};

export type TWedding = {
  id: string;
  user_id: string;
  groom: string;
  bride: string;
  event_date: string; // ISO date (YYYY-MM-DD)
  venue: string | null;
  design_config: DesignConfig; // JSONB
  slug: string;
  image_url?: string | null;
  template_id?: string | null;
  created_at: string; // ISO timestamp
};

export type CreateWeddingInput = {
  groom: string;
  user_id?: string;
  bride: string;
  event_date: string;
  venue: string;
  image_url?: string | null;
  slug?: string;
  template_id: string;
};

export type GuestGroupType = "single" | "couple";
export type InvitationStatus = "draft" | "sending" | "sent" | "failed";
export type InvitationChannel = "manual" | "whatsapp" | "email";

export type GuestPersonInput = {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  is_child: boolean;
};

export type CreateGuestGroupInput = {
  wedding_id: string;
  group_type: string;
  table_number?: number | null;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  is_child: boolean;
};

export type GuestInput = {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  is_child: boolean;
};

export type ICreateGuestGroup = {
  wedding_id: string;
  group_type: string;
  table_number?: number | null;
  guests: GuestInput[];
};

export type CreateGuestInput = GuestPersonInput & {
  wedding_id: string;
  guest_group_id?: string | null;
};

export type GuestGroupInterface = {


  wedding_id: string

  name: string | null // ex: "Jean & Marie"

  invitation_slug: string | null

  group_type?: GuestGroupType

  max_guests: number

  plus_one_allowed: boolean

}

export type UserWeddingOption = {
  id: string;
  groom: string;
  bride: string;
  event_date: string;
};

export type GuestWithWedding = {
  id: string;
  wedding_id: string;
  guest_group_id?: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  is_child: boolean;
  status: "invited" | "confirmed" | "checked-in";
  checked_in_at: string | null;
  qr_code_token: string;
  weddings?: {
    id: string;
    groom: string;
    bride: string;
    event_date: string;
  } | null;
  guest_group?: GuestGroup
};

export type CheckInResult = {
  status: "checked-in" | "already-checked-in";
  guest: unknown;
};


export type GuestGroup = {
  id: string

  wedding_id: string

  name: string | null // ex: "Jean & Marie"

  invitation_slug: string | null

  group_type: GuestGroupType

  max_guests: number

  plus_one_allowed: boolean

  table_number?: number | null

  invitation_status?: InvitationStatus | null

  invitation_sent_at?: string | null

  invitation_channel?: InvitationChannel | null

  invitation_error?: string | null

  created_at: string
}

export type RsvpResponse = {
  id: string;
  invitation_id: string;
  attending: boolean | null;
  dietary_restrictions: string | null;
  message: string | null;
  responded_at: string | null;
};

export type InvitationDetails = GuestGroup & {
  guests: GuestWithWedding[];
  rsvp_response?: RsvpResponse | null;
  wedding: {
    id: string;
    groom: string;
    bride: string;
    event_date: string;
    venue: string | null;
    slug: string;
    image_url?: string | null;
    template_id?: string | null;
    design_config?: DesignConfig | null;
  } | null;
};

export type SubmitRsvpInput = {
  invitation_id: string;
  attending: boolean;
  dietary_restrictions?: string;
  message?: string;
};

export type GuestGroupWithGuests = GuestGroup & {
  guests: GuestWithWedding[];
  rsvp_status?: string;
  weddings?: {
    id: string;
    groom: string;
    bride: string;
    event_date: string;
  } | null;
}
