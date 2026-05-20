"use client";

import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  Sparkles,
  Ticket,
} from "lucide-react";

type Invitation = {
  id: string;
  wedding_id: string;
  name: string;
  invitation_slug: string;
  max_guests: number;
  plus_one_allowed: boolean;
  group_type: "single" | "couple";
  table_number: number | null;
  rsvp_status: "pending" | "confirmed" | "declined";
  rsvp_confirmed_at: string | null;
  checked_in_at: string | null;
  qr_token: string;
};

export function InvitationClient({ invitation }: { invitation: Invitation }) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState(invitation.rsvp_status);
  const [loading, setLoading] = useState(false);

  const qrValue = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-ticket/${invitation.qr_token}`;

  const confirmPresence = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/invitations/confirm-presence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitationId: invitation.id,
        }),
      });

      if (res.ok) {
        setStatus("confirmed");
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = async () => {
    if (!ticketRef.current) return;

    const canvas = await html2canvas(ticketRef.current, {
      scale: 3,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = `billet-${invitation.name}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="min-h-screen bg-gradient-dark px-4 py-8 text-foreground">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-4xl border border-border bg-card shadow-2xl glow-gold">
        <HeroSection />

        <div className="grid gap-6 p-5 md:p-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <SectionTitle
              eyebrow="Programme"
              title="Déroulement de la journée"
              description="Retrouvez les moments importants de la célébration."
            />

            <div className="space-y-4">
              <ProgramItem
                time="11H30"
                title="Mariage civil"
                location="Mairie de Bertoua 2e"
              />

              <ProgramItem
                time="14H00"
                title="Bénédiction nuptiale & vin d’honneur"
                location="Travaux publics"
              />

              <ProgramItem
                time="20H30"
                title="Soirée de gala"
                location="Salle Paul Artcam"
              />
            </div>
          </div>

          <GuestCard
            invitation={invitation}
            status={status}
            loading={loading}
            onConfirm={confirmPresence}
          />
        </div>

        <div className="border-t border-border p-5 md:p-8">
          <SectionTitle
            eyebrow="Billet"
            title="Votre billet d’entrée"
            description="Téléchargez ce billet et présentez-le à l’entrée le jour de la cérémonie."
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <TicketCard
              refElement={ticketRef}
              invitation={invitation}
              qrValue={qrValue}
            />

            <div className="glass-gold rounded-3xl p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-gold">
                  <Ticket className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-card-foreground">
                    Billet personnel et sécurisé
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Ce billet contient un QR Code unique. Il permet à l’équipe
                    d’accueil de vérifier votre identité, votre nombre de places,
                    votre table et de confirmer si vous êtes déjà entré ou non.
                  </p>
                </div>
              </div>

              <button
                onClick={downloadTicket}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-gold transition hover:opacity-90 disabled:opacity-60"
              >
                <Download className="h-5 w-5" />
                Télécharger votre billet
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroSection() {
  return (
    <div className="relative overflow-hidden border-b border-border bg-card px-6 py-12 text-center md:px-10 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.25),transparent_45%)]" />
      <div className="absolute -left-20 top-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-gold">
          <Sparkles className="h-7 w-7" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Invitation de mariage
        </p>

        <h1 className="gold-text mt-5 font-serif text-5xl font-bold italic leading-tight md:text-7xl">
          Ghislaine & Sosthène
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          Ont le plaisir de vous faire part de leur union civile et de vous
          inviter à partager ce moment précieux avec eux.
        </p>

        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary">
          <CalendarDays className="h-5 w-5" />
          Samedi 8 Août
        </div>
      </div>
    </div>
  );
}

function GuestCard({
  invitation,
  status,
  loading,
  onConfirm,
}: {
  invitation: Invitation;
  status: Invitation["rsvp_status"];
  loading: boolean;
  onConfirm: () => void;
}) {
  return (
    <div className="glass-card rounded-3xl p-5 md:p-6">
      <p className="text-sm font-medium text-muted-foreground">
        Votre invitation
      </p>

      <h2 className="mt-2 text-2xl font-bold text-card-foreground">
        {invitation.name}
      </h2>

      <div className="mt-5 grid gap-3">
        <Info
          label="Type"
          value={invitation.group_type === "couple" ? "Couple" : "Célibataire"}
        />

        <Info label="Places" value={`${invitation.max_guests}`} />

        <Info
          label="Table"
          value={
            invitation.table_number
              ? `Table ${invitation.table_number}`
              : "Non définie"
          }
        />
      </div>

      {status === "confirmed" ? (
        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success">
          <CheckCircle2 className="h-5 w-5" />
          Votre présence est confirmée.
        </div>
      ) : (
        <button
          onClick={onConfirm}
          disabled={loading}
          className="mt-5 w-full rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-gold transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Confirmation..." : "Confirmer ma présence"}
        </button>
      )}
    </div>
  );
}

function TicketCard({
  refElement,
  invitation,
  qrValue,
}: {
  refElement: React.RefObject<HTMLDivElement | null>;
  invitation: Invitation;
  qrValue: string;
}) {
  const guestDisplayName = formatGuestName(invitation);
  return (
    <div
      ref={refElement}
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-primary/30 bg-white p-6 text-center text-black shadow-2xl"
    >
      {/* Fond léger */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#fffdf8_0%,#fffaf1_100%)]" />
      <div className="absolute inset-3 rounded-[1.6rem] border border-[#ead39a]" />

      {/* Coins décoratifs */}
      <FloralCorner position="top-left" />
      <FloralCorner position="top-right" />
      <FloralCorner position="bottom-left" />
      <FloralCorner position="bottom-right" />

      {/* Contenu */}
      <div className="relative z-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9b7a35]">
          Billet d’entrée
        </p>

        <h3 className="mt-4 font-serif text-4xl font-semibold italic leading-tight text-[#7a5a1f]">
          Ghislaine
          <br />
          <span className="inline-block mt-1">Sosthène</span>
        </h3>

        <div className="mt-3 flex items-center justify-center gap-2 text-[#b58b2c]">
          <span className="h-px w-10 bg-[#d8b56a]" />
          <span className="text-lg">✦</span>
          <span className="h-px w-10 bg-[#d8b56a]" />
        </div>

        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#7d5d25]">
          Samedi 8 Août
        </p>

        <div className="mx-auto mt-5 h-px w-full max-w-[220px] bg-[#e8d7ad]" />

        <div className="mt-5 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#9e8a60]">
              Nom de l’invité
            </p>
            <p className="mt-1 text-xl font-bold text-[#3f2c12]">
              {guestDisplayName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#eadcb8] bg-[#fffaf0] px-3 py-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[#9e8a60]">
                Places
              </p>
              <p className="mt-1 text-base font-bold text-[#3f2c12]">
                {invitation.max_guests}
              </p>
            </div>

            <div className="rounded-2xl border border-[#eadcb8] bg-[#fffaf0] px-3 py-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[#9e8a60]">
                Table
              </p>
              <p className="mt-1 text-base font-bold text-[#3f2c12]">
                {invitation.table_number ?? "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 flex w-fit items-center justify-center rounded-[1.5rem] border border-[#e6d19d] bg-white p-4 shadow-sm">
          <QRCodeCanvas value={qrValue} size={160} />
        </div>

        <p className="mt-4 text-xs text-[#8d7a53]">
          Présentez ce billet à l’entrée
        </p>
      </div>
    </div>
  );
}


function FloralCorner({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const positionClass = {
    "top-left": "left-0 top-0",
    "top-right": "right-0 top-0 rotate-90",
    "bottom-left": "left-0 bottom-0 -rotate-90",
    "bottom-right": "right-0 bottom-0 rotate-180",
  }[position];

  return (
    <div className={`absolute ${positionClass} z-0 h-40 w-40 pointer-events-none`}>
      {/* Tige / branche */}
      <div className="absolute left-6 top-8 h-24 w-[2px] rounded-full bg-gradient-to-b from-[#d2a94a] via-[#f0d891] to-[#b7862d]" />
      <div className="absolute left-8 top-10 h-[2px] w-20 rounded-full bg-gradient-to-r from-[#d2a94a] via-[#f0d891] to-[#b7862d]" />

      {/* Feuilles */}
      <div className="absolute left-10 top-10 h-4 w-8 rotate-[-25deg] rounded-full bg-gradient-to-r from-[#b7862d] to-[#efd27d]" />
      <div className="absolute left-14 top-16 h-4 w-8 rotate-[35deg] rounded-full bg-gradient-to-r from-[#b7862d] to-[#efd27d]" />
      <div className="absolute left-20 top-8 h-4 w-8 rotate-[10deg] rounded-full bg-gradient-to-r from-[#b7862d] to-[#efd27d]" />

      {/* Fleur principale */}
      <div className="absolute left-2 top-2 flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle,#fff6dc_5%,#e6c872_35%,#bf8d30_70%,#9a6a1d_100%)] shadow-sm">
        <div className="grid grid-cols-3 gap-[2px]">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="block h-3 w-3 rounded-full bg-[#f8e6b0]"
            />
          ))}
        </div>
      </div>

      {/* Petite fleur */}
      <div className="absolute left-24 top-20 h-8 w-8 rounded-full bg-[radial-gradient(circle,#fff6dc_10%,#e6c872_45%,#b7862d_100%)]" />

      {/* Perles */}
      <div className="absolute left-24 top-5 h-3 w-3 rounded-full bg-[#f4e2b7] shadow-sm" />
      <div className="absolute left-30 top-12 h-2.5 w-2.5 rounded-full bg-[#f4e2b7] shadow-sm" />
      <div className="absolute left-20 top-26 h-3 w-3 rounded-full bg-[#f4e2b7] shadow-sm" />
    </div>
  );
}
function ProgramItem({
  time,
  title,
  location,
}: {
  time: string;
  title: string;
  location: string;
}) {
  return (
    <div className="glass-card rounded-3xl p-5 transition hover:border-primary/30 hover:shadow-gold">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Clock className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-bold text-primary">{time}</p>
          <h3 className="mt-1 text-lg font-bold text-card-foreground">
            {title}
          </h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {location}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatGuestName(invitation: Invitation) {
  if (invitation.group_type === "couple") {
    return `Mr et Mme ${invitation.name}`;
  }

  return invitation.name;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">
        {title}
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}