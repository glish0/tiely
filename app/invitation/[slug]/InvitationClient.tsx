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

  Ticket,
} from "lucide-react";

import Image from "next/image";
import { Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function ShinyText({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block overflow-hidden">
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 -translate-x-full animate-[shine_2.8s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </span>
  );
}

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

  const qrValue = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/verify-ticket/${invitation.qr_token}`;

  /*   const confirmPresence = async () => {
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
    }; */

  const respondPresence = async (
    nextStatus: "confirmed" | "declined" | "pending"
  ) => {
    try {
      setLoading(true);

      const res = await fetch("/api/invitations/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitationId: invitation.id,
          status: nextStatus,
        }),
      });

      if (!res.ok) {
        throw new Error("Impossible d'enregistrer votre réponse.");
      }

      setStatus(nextStatus);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmPresence = () => {
    respondPresence("confirmed");
  };

  const declinePresence = () => {
    respondPresence("declined");
  };

  const resetPresence = () => {
    respondPresence("pending");
  };

  const downloadTicket = async () => {
    if (!ticketRef.current) return;

    await document.fonts.ready;

    const canvas = await html2canvas(ticketRef.current, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      removeContainer: true,

      onclone: (clonedDocument) => {
        const ticket = clonedDocument.querySelector("#ticket-to-download");

        if (ticket instanceof HTMLElement) {
          ticket.style.backgroundColor = "#ffffff";
          ticket.style.color = "#111111";
          ticket.style.boxShadow = "none";

          ticket.querySelectorAll("*").forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.boxShadow = "none";
            }
          });
        }
      },
    });

    const link = document.createElement("a");
    link.download = `billet-${formatFileName(invitation.name)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };


  function formatFileName(name: string) {
    return name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9À-ÿ-]/gi, "");
  }

  return (
    <main className="min-h-screen bg-invitation-light  pb-8 text-[#2f2412]">
      <HeroSection />
      <section className="mx-auto max-w-5xl overflow-hidden px-4 rounded-xl border border-[#ead39a] bg-white shadow-xl">


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
            onDecline={declinePresence}
            onReset={resetPresence}
          />
        </div>

        <div className="border-t border-[#ead39a] bg-[#fffdf8] p-5 md:p-8">
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

            <div className="rounded-3xl border border-[#ead39a] bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#9b6b1c] text-white shadow-lg">
                  <Ticket className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#2f2412]">
                    Billet personnel et sécurisé
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#6f5a35]">
                    Ce billet contient un QR Code unique. Il permet à l’équipe
                    d’accueil de vérifier votre identité, votre nombre de places,
                    votre table et de confirmer si vous êtes déjà entré ou non.
                  </p>
                </div>
              </div>

              <button
                onClick={downloadTicket}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#9b6b1c] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-[#7a5316] disabled:opacity-60"
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

/* function HeroSection() {
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
          Ont le plaisir de vous faire part de leur union civil et religieux.
        </p>

        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary">
          <CalendarDays className="h-5 w-5" />
          Samedi 8 Août
        </div>
      </div>
    </div>
  );
} */





export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src="/ghislaine_et_sosthene.jpeg"
        alt="Ghislaine et Sosthène"
        fill
        priority
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/45" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.35)_100%)]" />

      <div className="absolute left-6 top-6 h-24 w-24 rounded-full bg-[#d6a93d]/25 blur-3xl md:h-48 md:w-48" />
      <div className="absolute bottom-10 right-6 h-28 w-28 rounded-full bg-[#f6d77b]/25 blur-3xl md:h-56 md:w-56" />

      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-2 w-full max-w-3xl rounded border border-white/10 bg-white/5 px-3 py-4 text-center text-white shadow backdrop-blur-2xs md:px-6 md:py-6"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/20 shadow backdrop-blur">
          <Sparkles className="h-4 w-4 text-[#f6d77b]" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f6d77b]">
          Invitation de mariage
        </p>

        <h1 className="mt-5 font-serif text-xl font-bold italic leading-tight text-white drop-shadow-lg md:text-3xl">
          <ShinyText>Ghislaine</ShinyText>
          <span className="mx-3 text-[#f6d77b]">&</span>
          <ShinyText>Sosthène</ShinyText>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/95 drop-shadow md:text-base">
          Ont le plaisir de vous faire part de leur union civile et religieuse.
          Votre présence rendra cette journée encore plus belle et inoubliable.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/20 px-5 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur">
            <CalendarDays className="h-5 w-5 text-[#f6d77b]" />
            Samedi 8 Août - Bertoua
          </div>

          <div className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/20 px-5 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur">
            <Heart className="h-5 w-5 fill-[#f6d77b] text-[#f6d77b]" />
            Célébrons l’amour
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* function GuestCard({
  invitation,
  status,
  loading,
  onConfirm,
  onDecline,
}: {
  invitation: Invitation;
  status: Invitation["rsvp_status"];
  loading: boolean;
  onConfirm: () => void;
  onDecline: () => void;
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
      ) : status === "declined" ? (
        <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          Vous avez indiqué que vous ne serez pas présent(e).
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-gold transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Confirmation..." : "Confirmer ma présence"}
          </button>

          <button
            onClick={onDecline}
            disabled={loading}
            className="rounded-2xl border border-destructive/30 bg-destructive/10 px-5 py-3 font-semibold text-destructive transition hover:bg-destructive/15 disabled:opacity-60"
          >
            Je ne serai pas là
          </button>
        </div>
      )}
    </div>
  );
}
 */
function TicketCard({
  refElement,
  invitation,
  qrValue,
}: {
  refElement: React.RefObject<HTMLDivElement | null>;
  invitation: Invitation;
  qrValue: string;
}) {
  return (
    <div
      id="ticket-to-download"
      ref={refElement}
      className="relative mx-auto aspect-[527/746] w-full max-w-md overflow-hidden rounded-[1.5rem] border bg-white text-black"
      style={{
        borderColor: "#d8b56a",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
      }}
    >
      <img
        src="/sos_6.png"
        alt="Invitation Ghislaine et Sosthène"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* QR Code dynamique centré sans transform */}
      <div
        className="absolute z-20"
        style={{
          bottom: "3%",
          left: 0,
          right: 0,
          width: "34%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          className="rounded bg-white"
          style={{
            border: "1px solid #c69a3b",
            boxShadow: "0 8px 15px rgba(0,0,0,0.15)",
            padding: "2px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              marginBottom: "3px",
              textAlign: "center",
              fontSize: "5px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "#9b6b1c",
              lineHeight: 1.2,
            }}
          >
            Scan à l’entrée
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff",
              width: "100%",
            }}
          >
            <QRCodeCanvas
              value={qrValue}
              size={70}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={false}
              style={{
                display: "block",
              }}
            />
          </div>

          <p
            style={{
              marginTop: "3px",
              textAlign: "center",
              fontSize: "6px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#9b6b1c",
              lineHeight: 1.2,
            }}
          >
            Merci
          </p>
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
  onDecline,
  onReset
}: {
  invitation: Invitation;
  status: Invitation["rsvp_status"];
  loading: boolean;
  onConfirm: () => void;
  onDecline: () => void;
  onReset: () => void;
}) {
  return (
    <div className="rounded-3xl border border-[#ead39a] bg-white p-5 shadow-sm md:p-6">
      <p className="text-sm font-medium text-[#8a6a25]">
        Votre invitation
      </p>

      <h2 className="mt-2 text-2xl font-bold text-[#2f2412]">
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
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-2 rounded-2xl border border-green-600/30 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            Votre présence est confirmée.
          </div>

          <button
            onClick={onReset}
            disabled={loading}
            className="w-full rounded-2xl border border-[#d8b56a] bg-[#fffaf0] px-5 py-3 font-semibold text-[#7a5316] transition hover:bg-[#fff3d6] disabled:opacity-60"
          >
            {loading ? "Annulation..." : "Annuler ma confirmation"}
          </button>
        </div>
      ) : status === "declined" ? (
        <div className="mt-5 space-y-3">
          <div className="rounded-2xl border border-red-600/30 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            Vous avez indiqué que vous ne serez pas présent(e).
          </div>

          <button
            onClick={onReset}
            disabled={loading}
            className="w-full rounded-2xl border border-[#d8b56a] bg-[#fffaf0] px-5 py-3 font-semibold text-[#7a5316] transition hover:bg-[#fff3d6] disabled:opacity-60"
          >
            {loading ? "Modification..." : "Modifier ma réponse"}
          </button>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-2xl bg-[#9b6b1c] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-[#7a5316] disabled:opacity-60"
          >
            {loading ? "Confirmation..." : "Confirmer ma présence"}
          </button>

          <button
            onClick={onDecline}
            disabled={loading}
            className="rounded-2xl border border-red-300 bg-red-50 px-5 py-3 font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
          >
            Je serai indisponible
          </button>
        </div>
      )}
    </div>
  );
}



/* function ProgramItem({
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
} */

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
    <div className="rounded-3xl border border-[#ead39a] bg-white p-5 shadow-sm transition hover:border-[#d6a93d] hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff4d8] text-[#9b6b1c]">
          <Clock className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-bold text-[#9b6b1c]">{time}</p>

          <h3 className="mt-1 text-lg font-bold text-[#2f2412]">
            {title}
          </h3>

          <p className="mt-2 flex items-center gap-2 text-sm text-[#6f5a35]">
            <MapPin className="h-4 w-4 text-[#9b6b1c]" />
            {location}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatGuestName(invitation: Invitation) {
  const guestName = invitation.name.trim().toUpperCase();

  if (invitation.group_type === "couple") {
    return `Mr/Mme ${guestName}`;
  }

  return `Mr/Mme ${guestName}`;
}

/* function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  );
} */
/* 



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
} */
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#ead39a] bg-[#fffaf0] px-4 py-3">
      <p className="text-xs font-medium text-[#8a6a25]">{label}</p>
      <p className="font-semibold text-[#2f2412]">{value}</p>
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
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9b6b1c]">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-bold text-[#2f2412] md:text-3xl">
        {title}
      </h2>

      <p className="mt-2 max-w-xl text-sm leading-6 text-[#6f5a35]">
        {description}
      </p>
    </div>
  );
}