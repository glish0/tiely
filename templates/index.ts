export type WeddingTemplate = {
  id: string;
  name: string;
  description: string;
  accent: string;
};

export const weddingTemplates: WeddingTemplate[] = [
  {
    id: "romantic",
    name: "Romantic",
    description: "Floral, soft, elegant",
    accent: "bg-rose-500",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean, bold, minimal",
    accent: "bg-sky-500",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Formal, timeless, refined",
    accent: "bg-amber-500",
  },
];

export const defaultWeddingTemplateId = weddingTemplates[0].id;
