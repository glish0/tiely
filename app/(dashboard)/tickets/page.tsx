"use client";

import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  MessageCircle,
  QrCode,
  Search,
  Ticket,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTickets, type TicketItem } from "@/hooks/useTickets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TicketsPage() {
  const { data: tickets = [], isLoading, isError, error } = useTickets();
  const [search, setSearch] = useState("");

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const query = search.toLowerCase();

      return (
        ticket.name.toLowerCase().includes(query) ||
        ticket.invitation_slug.toLowerCase().includes(query) ||
        ticket.group_type.toLowerCase().includes(query)
      );
    });
  }, [tickets, search]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="glass-card flex items-center gap-3 rounded-2xl px-5 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Chargement des tickets...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass-card mx-auto max-w-md rounded-3xl p-6 text-center">
        <XCircle className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-4 text-xl font-bold text-foreground">
          Erreur de chargement
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Impossible de charger les tickets."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm glow-gold">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.18),transparent_40%)]" />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Tickets
            </p>

            <h1 className="mt-2 text-3xl font-bold text-foreground">
              Gestion des billets
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Consultez les billets, copiez les liens d’invitation, envoyez les
              invitations WhatsApp et suivez les entrées validées.
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Ticket className="h-7 w-7" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <TicketStatCard
          label="Total billets"
          value={tickets.length}
          icon={<Ticket className="h-5 w-5" />}
        />
        <TicketStatCard
          label="Présences confirmées"
          value={tickets.filter((t) => t.rsvp_status === "confirmed").length}
          icon={<UserCheck className="h-5 w-5" />}
        />
        <TicketStatCard
          label="Entrées validées"
          value={tickets.filter((t) => Boolean(t.checked_in_at)).length}
          icon={<QrCode className="h-5 w-5" />}
        />
      </div>

      <div className="glass-card rounded-3xl p-5">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Liste des billets
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredTickets.length} billet(s) trouvé(s)
            </p>
          </div>

          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un invité..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredTickets.length === 0 ? (
            <div className="rounded-2xl border border-border bg-background/60 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Aucun billet trouvé.
              </p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function TicketRow({ ticket }: { ticket: TicketItem }) {
  const invitationUrl = getInvitationUrl(ticket.invitation_slug);
  const weddingName = ticket.weddings
    ? `${ticket.weddings.groom} & ${ticket.weddings.bride}`
    : "notre mariage";

  const message = buildInvitationMessage(ticket, invitationUrl, weddingName);

  const copyLink = async () => {
    await navigator.clipboard.writeText(invitationUrl);
  };

  const openInvitation = () => {
    window.open(invitationUrl, "_blank");
  };

  const sendWhatsApp = () => {
    const phone = "";
    const whatsappUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4 transition hover:border-primary/40 hover:bg-primary/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-foreground">{ticket.name}</h3>

            <Badge>
              {ticket.group_type === "couple" ? "Couple" : "Individuel"}
            </Badge>

            {ticket.rsvp_status === "confirmed" ? (
              <StatusBadge type="success" label="Confirmé" />
            ) : (
              <StatusBadge type="warning" label="En attente" />
            )}

            {ticket.checked_in_at ? (
              <StatusBadge type="success" label="Entré" />
            ) : (
              <StatusBadge type="muted" label="Non entré" />
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>{weddingName}</span>
            <span>•</span>
            <span>{ticket.max_guests} place(s)</span>
            <span>•</span>
            <span>
              {ticket.table_number ? `Table ${ticket.table_number}` : "Table non définie"}
            </span>
          </div>

          <p className="mt-2 truncate text-xs text-muted-foreground">
            {invitationUrl}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={copyLink}
          >
            <Copy className="h-4 w-4" />
            Copier
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={openInvitation}
          >
            <ExternalLink className="h-4 w-4" />
            Voir
          </Button>

          <Button
            size="sm"
            className="gap-2 rounded-xl bg-primary text-primary-foreground"
            onClick={sendWhatsApp}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}

function TicketStatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {value.toLocaleString("fr-FR")}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
      {children}
    </span>
  );
}

function StatusBadge({
  type,
  label,
}: {
  type: "success" | "warning" | "muted";
  label: string;
}) {
  const className = {
    success: "border-success/30 bg-success/10 text-success",
    warning: "border-warning/30 bg-warning/10 text-warning",
    muted: "border-border bg-muted text-muted-foreground",
  }[type];

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

function getInvitationUrl(slug: string) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://tiely.vercel.app";

  return `${siteUrl}/invitation/${slug}`;
}

function buildInvitationMessage(
  ticket: TicketItem,
  invitationUrl: string,
  weddingName: string
) {
  const guestName = formatGuestName(ticket.name, ticket.group_type);

  return [
    `✨ Invitation de mariage ✨`,
    ``,
    `Bonjour ${guestName},`,
    ``,
    `Nous avons le plaisir de vous inviter au mariage de ${weddingName}.`,
    ``,
    `Veuillez ouvrir votre invitation personnalisée ici :`,
    invitationUrl,
    ``,
    `Vous pourrez confirmer votre présence et télécharger votre billet d’entrée avec QR Code.`,
    ``,
    `Avec joie,`,
    `${weddingName} 💍`,
  ].join("\n");
}

function formatGuestName(name: string, groupType: string) {
  const uppercasePart = name
    .trim()
    .split(/\s+/)
    .filter((word) => word === word.toUpperCase() && /[A-ZÀ-Ÿ]/.test(word))
    .join(" ");

  const finalName = uppercasePart || name.trim().toUpperCase();

  if (groupType === "couple") {
    return `MR ET MME ${finalName}`;
  }

  return finalName;
}