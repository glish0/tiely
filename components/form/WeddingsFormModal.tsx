"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";



import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ensureFreshSession, supabase } from "@/lib/config/supabase";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import Image from "next/image";
import { useCreateWedding } from "@/hooks/useWedding";
import { useAuth } from "@/lib/contexts/AuthContexte";
import { cn } from "@/lib/utils";
import { defaultWeddingTemplateId, weddingTemplates } from "@/templates";
import { ArrowLeft, Check, Palette } from "lucide-react";


const schema = z.object({
  groom: z.string().min(2),
  bride: z.string().min(2),
  event_date: z.string(),
  venue: z.string(),
  template_id: z.string().min(1),
  image: z.any().optional(),
});

type FormValues = z.infer<typeof schema>;

export function WeddingFormModal({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [step, setStep] = useState<"template" | "details">("template");
    const { mutateAsync: addWedding, isPending } = useCreateWedding();
    const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      groom: "",
      bride: "",
      event_date: "",
      venue: "",
      template_id: defaultWeddingTemplateId,
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setStep("template");
      setPreview(null);
      form.reset();
    }
  };


  const uploadImage = async (file: File) => {
    const session = await ensureFreshSession();

    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const fileName = `${session.user.id}/${Date.now()}-${safeFileName}`;

    const { error } = await supabase.storage
      .from("weddings")
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from("weddings")
      .getPublicUrl(fileName);

      

    return publicUrl.publicUrl;
  };

  

  const onSubmit = async (values: FormValues) => {
  try {
    setLoading(true);

    let imageUrl: string | null = null;

    const imageFile = values.image?.[0];

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    await addWedding({
      user_id: user?.id,
      groom: values.groom,
      bride: values.bride,
      event_date: values.event_date,
      venue: values.venue,
      template_id: values.template_id,
      image_url: imageUrl,
    });

    form.reset();
    setPreview(null);
    setStep("template");
    setOpen(false);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {step === "template" ? "Choisir un template" : "Créer un mariage"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === "template" && (
              <FormField
                control={form.control}
                name="template_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {weddingTemplates.map((template) => {
                        const selected = field.value === template.id;

                        return (
                          <button
                            key={template.id}
                            type="button"
                            onClick={() => field.onChange(template.id)}
                            className={cn(
                              "relative rounded-lg border p-3 text-left transition-colors hover:border-primary/40",
                              selected
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card"
                            )}
                          >
                            <span
                              className={cn(
                                "mb-3 flex h-10 w-10 items-center justify-center rounded-md text-white",
                                template.accent
                              )}
                            >
                              <Palette className="h-5 w-5" />
                            </span>
                            <span className="block text-sm font-medium text-foreground">
                              {template.name}
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                              {template.description}
                            </span>
                            {selected && (
                              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="h-3 w-3" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {step === "details" && (
              <>

            {/* Groom */}
            <FormField
              control={form.control}
              name="groom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marié</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bride */}
            <FormField
              control={form.control}
              name="bride"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mariée</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="event_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lieu</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* IMAGE UPLOAD */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image du mariage</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                     onChange={(e) => {
  const file = e.target.files?.[0];
  field.onChange(e.target.files);

  if (file) {
    setPreview(URL.createObjectURL(file));
  }
}}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {preview && (  
  <Image src={preview} alt="pp" width={32} height={32} className="object-cover" />
)}
              </>
            )}

            {step === "template" ? (
              <Button
                type="button"
                className="w-full"
                onClick={() => setStep("details")}
              >
                Continuer
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => setStep("template")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button type="submit" className="flex-1" disabled={loading || isPending}>
                  {loading ? "Enregistrement..." : "Créer"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
