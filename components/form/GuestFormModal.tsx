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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { useWeddingOptions } from "@/hooks/useWedding";

import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useLanguage } from "@/lib/contexts/LanguageContexte";
import { useCreateGuest } from "@/hooks/useGuest";


const guestSchema = z.object({
  first_name: z.string().min(2, "Le nom est obligatoire"),
  last_name: z.string().min(2, "Le prénom est obligatoire"),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  is_child: z.boolean().default(false),
});

const schema = z.object({
  wedding_id: z.string().min(1, "Le mariage est obligatoire"),
  group_type: z.enum(["single", "couple"]),
  table_number: z.number().nullable(),
  guests: z.array(guestSchema).min(1).max(2),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;




export function GuestFormModal({ trigger }: { trigger: React.ReactNode }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: weddings = [] } = useWeddingOptions();
  const { mutate: createGuestMutation } = useCreateGuest();
  const selectedWeddingId = weddings[0]?.id || "";

  const form = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      wedding_id: weddings[0]?.id || "",
      group_type: "single",
      table_number: null,
      guests: [
        {
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          is_child: false,
        },
        {
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          is_child: false,
        },
      ],
    },
  });

  const groupType = form.watch("group_type");

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const expectedGuestCount = values.group_type === "couple" ? 2 : 1;

      await createGuestMutation({
        wedding_id: values.wedding_id,
        table_number: values.table_number,
        group_type: values.group_type,
        guests: values.guests.slice(0, expectedGuestCount),
      });

      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderGuestFields = (index: 0 | 1, title: string) => (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          control={form.control}
          name={`guests.${index}.first_name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`guests.${index}.last_name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          control={form.control}
          name={`guests.${index}.email`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`guests.${index}.phone`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <FormField
          control={form.control}
          name={`guests.${index}.is_child`}
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value ?? false}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormLabel>Enfant</FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{t("addGuest")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2 "
          >
            <div>
              <Label>Mariage</Label>
              <Select
                value={form.watch("wedding_id")}
                onValueChange={(value) => form.setValue("wedding_id", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choisir un mariage" />
                </SelectTrigger>
                <SelectContent>
                  {weddings.map((wedding) => (
                    <SelectItem key={wedding.id} value={wedding.id}>
                      {wedding.groom} & {wedding.bride}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="group_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d&apos;invitation</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Personne seule</SelectItem>
                        <SelectItem value="couple">Couple</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormField
                  control={form.control}
                  name="table_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Table</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? null : Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="max-h-72 flex gap-4 flex-col overflow-auto">
              {renderGuestFields(0, "Invité principal")}

              {groupType === "couple" && renderGuestFields(1, "Deuxième invité")}
            </div>




            <Button
              type="submit"
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Ajout..." : t("addGuest")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
