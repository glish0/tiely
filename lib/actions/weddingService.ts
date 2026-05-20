import { CreateWeddingInput, TWedding } from "@/types";
import { ensureFreshSession, supabase } from "../config/supabase";

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildWeddingSlugBase = ({
  groom,
  bride,
  event_date,
  venue,
}: CreateWeddingInput) => {
  const datePart = event_date ? event_date.replace(/-/g, "") : "";
  return slugify([groom, bride, datePart, venue].filter(Boolean).join(" "));
};

export const generateUniqueWeddingSlug = async (payload: CreateWeddingInput) => {
  await ensureFreshSession();

  const baseSlug = buildWeddingSlugBase(payload) || `mariage-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const { data, error } = await supabase
      .from("weddings")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return slug;
    }

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
};

export const createWedding = async (payload: CreateWeddingInput) => {
  await ensureFreshSession();

  const slug = payload.slug || (await generateUniqueWeddingSlug(payload));

  const { data, error } = await supabase
    .from("weddings")
    .insert({ ...payload, slug })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};


export const myWedding = async (user_id?: string): Promise<TWedding[]> => {
  const { data, error} = await supabase
    .from('weddings')
    .select('*')
    .eq('user_id', user_id)

  if(error){ throw new Error(error.message)
    }

    return data

}