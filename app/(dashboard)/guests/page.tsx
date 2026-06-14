"use client";

import { useMemo, useState } from "react";

import { motion } from "framer-motion";
import { Copy, Edit, ExternalLink, Plus, Search, Send, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
} from "@/lib/actions/guestService";
import { useLanguage } from "@/lib/contexts/LanguageContexte";
import {

  useDeleteGuest,
  useGetGuestsGroupForCurrentUser,
  useGetUserWedding,
  useMarkAllInvitationsSent,
  useMarkInvitationSent,
} from "@/hooks/useGuest";
import {
  GuestGroupWithGuests,
} from "@/types";
import { GuestFormModal } from "@/components/form/GuestFormModal";

const statusColors: Record<string, string> = {
  "invited": "bg-warning/15 text-warning border-warning/20",
  "confirmed": "bg-primary/15 text-primary border-primary/20",
  "declined": "bg-destructive/15 text-destructive border-destructive/20",
  "checked-in": "bg-success/15 text-success border-success/20",
};

const statusLabels: Record<string, string> = {
  declined: "Refusé",
};

const invitationStatusColors: Record<string, string> = {
  draft: "bg-muted/20 text-muted-foreground border-border",
  sending: "bg-warning/15 text-warning border-warning/20",
  sent: "bg-success/15 text-success border-success/20",
  failed: "bg-destructive/15 text-destructive border-destructive/20",
};

const invitationStatusLabels: Record<string, string> = {
  draft: "Brouillon",
  sending: "Envoi",
  sent: "Envoyée",
  failed: "Échec",
};



const getGroupStatus = (group: GuestGroupWithGuests) => {
  if (
    group.guests &&
    group.guests.every((guest) => guest.status === "checked-in")
  ) {
    return "checked-in";
  }

  if (group.rsvp_status === 'confirmed') {
    return "confirmed";
  }

  if (group.rsvp_status === 'declined') {
    return "declined";
  }

  return "invited";
};

export default function GuestsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");


  const markInvitationSentMutation = useMarkInvitationSent();
  const markAllInvitationsSentMutation = useMarkAllInvitationsSent();

  const { data: weddings = [], isLoading: weddingsLoading } = useGetUserWedding()


  const { data: guestGroups = [], isLoading: guestsLoading } = useGetGuestsGroupForCurrentUser()
  const { mutateAsync: deleteGuestMutation, isPending: isDeleting } =
    useDeleteGuest();

  const handleDeleteGuest = async (groupId: string) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cet invité ? Cette action est irréversible."
    );

    if (!confirmed) return;

    await deleteGuestMutation(groupId);
  };

  const filtered = useMemo(() => {
    return guestGroups.filter((group) => {
      const searchable = [
        group.name ?? "",
        group.group_type,
        group.table_number ? `table ${group.table_number}` : "",
        group.weddings
          ? `${group.weddings.groom} ${group.weddings.bride}`
          : "",
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = searchable.includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || getGroupStatus(group) === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [filterStatus, guestGroups, searchQuery]);



  const getInvitationUrl = (slug: string | null) => {
    if (!slug || typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/invitation/${slug}`;
  };

  const copyInvitationLink = async (slug: string | null) => {
    const url = getInvitationUrl(slug);

    if (!url) {
      toast.error("Lien d'invitation indisponible");
      return;
    }

    await navigator.clipboard.writeText(url);
    toast.success("Lien d'invitation copie");
  };

  const buildInvitationMessage = (group: GuestGroupWithGuests) => {
    const url = getInvitationUrl(group.invitation_slug);

    const guestName = group.name?.trim().toUpperCase() || "INVITÉ(E)";

    const weddingName = group.weddings
      ? `${group.weddings.groom} & ${group.weddings.bride}`
      : "notre mariage";

    const displayGuestName =
      group.group_type === "couple"
        ? `MR ET MME ${guestName}`
        : guestName;

    return [
      `✨ Invitation de mariage ✨`,
      ``,
      `Bonjour ${displayGuestName},`,
      ``,
      `Nous avons le plaisir de vous inviter au mariage de ${weddingName}.`,
      ``,
      `Veuillez ouvrir votre invitation personnalisée ici :`,
      `${url}`,
      ``,
      `Vous pourrez confirmer votre présence et télécharger votre billet d’entrée avec QR Code.`,
      ``,
      `Avec joie,`,
      `${weddingName} 💍`,
    ].join("\n");
  };

  const sendInvitation = async (group: GuestGroupWithGuests) => {
    const url = getInvitationUrl(group.invitation_slug);

    if (!url) {
      toast.error("Lien d'invitation indisponible");
      return;
    }

    const message = buildInvitationMessage(group);

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Invitation de mariage",
          text: message,
          url,
        });
      } else {
        await navigator.clipboard.writeText(message);
        toast.info("Message d'invitation copie");
      }

      await markInvitationSentMutation.mutateAsync({
        invitationId: group.id,
        channel: "manual",
      });
      toast.success("Invitation marquee comme envoyee");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        toast.info("Envoi annule");
        return;
      }

      toast.error("Impossible d'envoyer l'invitation", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  const sendAllInvitations = async () => {
    const sendableGroups = guestGroups.filter(
      (group) => group.invitation_slug && group.invitation_status !== "sent"
    );

    if (!sendableGroups.length) {
      toast.info("Aucune invitation a envoyer");
      return;
    }

    try {
      await navigator.clipboard.writeText(
        sendableGroups.map(buildInvitationMessage).join("\n\n---\n\n")
      );
      await markAllInvitationsSentMutation.mutateAsync({ channel: "manual" });
      toast.success(`${sendableGroups.length} invitations marquees envoyees`);
    } catch (error) {
      toast.error("Impossible d'envoyer toutes les invitations", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">{t("guests")}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={!guestGroups.length || markAllInvitationsSentMutation.isPending}
            onClick={sendAllInvitations}
          >
            <Send className="h-4 w-4" />
            {markAllInvitationsSentMutation.isPending
              ? "Envoi..."
              : "Envoyer tout"}
          </Button>
          <Button variant="secondary" size="sm" className="gap-2" disabled>
            <Upload className="h-4 w-4" /> {t("importCsv")}
          </Button>
          <GuestFormModal
            mode="create"
            trigger={
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("createGuests")}
              </Button>
            }
          />
        </div>
      </div>

      {!weddingsLoading && !weddings.length && (
        <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          Créez d&apos;abord un mariage avant d&apos;ajouter des invités.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="invited">{t("invited")}</SelectItem>
            <SelectItem value="confirmed">{t("confirmed")}</SelectItem>
            <SelectItem value="declined">{statusLabels.declined}</SelectItem>
            <SelectItem value="checked-in">{t("checked-in")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">
                  Mariage
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">
                  Invitation
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">
                  Membres
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">
                  Type
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">
                  Table
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">
                  {t("status")}
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">
                  Envoi
                </th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">
                  Lien
                </th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">
                  <Edit className="h-4 w-4" />
                </th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">
                  Supprimer
                </th>
              </tr>
            </thead>
            <tbody>
              {guestsLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-8 text-center text-sm text-muted-foreground"
                  >
                    Chargement...
                  </td>
                </tr>
              ) : filtered?.length ? (
                filtered.map((group, i) => {
                  const status = getGroupStatus(group);
                  const invitationStatus = group.invitation_status ?? "draft";

                  return (
                    <motion.tr
                      key={group.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50 hover:bg-secondary/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">
                        {group.weddings
                          ? `${group.weddings.groom} & ${group.weddings.bride}`
                          : "-"}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium text-foreground">
                        {group.name}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">
                        {group.guests?.length ? (
                          <div className="space-y-1">
                            {group.guests.map((guest) => (
                              <div key={guest.id}>
                                {guest.first_name} {guest.last_name}
                              </div>
                            ))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant="outline"
                          className="text-xs border-border text-muted-foreground"
                        >
                          {group.group_type === "couple" ? "Couple" : "Seul"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">
                        {group.table_number
                          ? `Table ${group.table_number}`
                          : "-"}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          className={`text-xs border ${statusColors[status]}`}
                        >
                          {statusLabels[status] ?? t(status)}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          className={`text-xs border ${invitationStatusColors[invitationStatus]
                            }`}
                        >
                          {invitationStatusLabels[invitationStatus]}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            disabled={markInvitationSentMutation.isPending}
                            onClick={() => sendInvitation(group)}
                          >
                            <Send className="h-4 w-4" />
                            <span className="sr-only">
                              Envoyer l&apos;invitation
                            </span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => copyInvitationLink(group.invitation_slug)}
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">
                              Copier le lien d&apos;invitation
                            </span>
                          </Button>
                          {group.invitation_slug && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                window.open(
                                  getInvitationUrl(group.invitation_slug),
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">
                                Ouvrir l&apos;invitation
                              </span>
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end">
                          <GuestFormModal
                            mode="edit"
                            guestGroup={group}
                            trigger={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Modifier l&apos;invité</span>
                              </Button>
                            }
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            disabled={isDeleting}
                            onClick={() => handleDeleteGuest(group.id)}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Supprimer l&apos;invité</span>
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-8 text-center text-sm text-muted-foreground"
                  >
                    Aucun invité trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
