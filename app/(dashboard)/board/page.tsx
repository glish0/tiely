"use client";

import {
  Users,
  Send,
  UserCheck,
  TrendingUp,
  Plus,
  Ticket,
  CalendarHeart,
  QrCode,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContexte";
import { StatCard } from "@/components/StatCard";
import { useRouter } from "next/navigation";
import { useDashboardStats } from "@/hooks/useDashboard";

const recentActivity = [
  {
    id: 1,
    text: "Activité récente bientôt disponible",
    time: "Maintenant",
    type: "info",
  },
];

const quickActions = [
  {
    title: "Ajouter un invité",
    description: "Créer une invitation simple ou couple",
    icon: Plus,
    href: "/guests",
  },
  {
    title: "Générer les billets",
    description: "Créer les billets avec QR Code",
    icon: Ticket,
    href: "/tickets",
  },
  {
    title: "Gérer les mariages",
    description: "Voir ou créer un événement",
    icon: CalendarHeart,
    href: "/weddings",
  },
  {
    title: "Scanner un billet",
    description: "Valider l’entrée d’un invité",
    icon: QrCode,
    href: "/verify-ticket",
  },
];

export default function DashboardHome() {
  const { t } = useLanguage();
  const router = useRouter();

  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="glass-card flex items-center gap-3 rounded-2xl px-5 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Chargement du dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="glass-card max-w-md rounded-3xl p-6 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h2 className="mt-4 text-xl font-bold text-foreground">
            Impossible de charger le dashboard
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Une erreur est survenue."}
          </p>
        </div>
      </div>
    );
  }

  const pendingRate = Math.max(0, 100 - stats.attendanceRate);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm glow-gold"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.18),transparent_40%)]" />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
              {t("overview")}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Suivez les invités, les confirmations, les billets et les entrées
              validées.
            </p>
          </div>

          <Button
            onClick={() => router.push("/guests")}
            className="gap-2 rounded-2xl bg-primary text-primary-foreground shadow-gold hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            {t("addGuest")}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("totalGuests")}
          value={stats.totalGuests.toLocaleString("fr-FR")}
          icon={<Users className="h-5 w-5" />}
          change={`${stats.totalGuestGroups} groupes d’invités`}
          delay={0}
        />

        <StatCard
          title="Invitations"
          value={stats.totalGuestGroups.toLocaleString("fr-FR")}
          icon={<Send className="h-5 w-5" />}
          change={`${stats.confirmedGroups} confirmées`}
          delay={0.1}
        />

        <StatCard
          title={t("checkedIn")}
          value={stats.checkedInGroups.toLocaleString("fr-FR")}
          icon={<UserCheck className="h-5 w-5" />}
          change="Entrées validées"
          delay={0.2}
        />

        <StatCard
          title={t("attendanceRate")}
          value={`${stats.attendanceRate}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          change={`${pendingRate}% en attente`}
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-3xl p-5"
        >
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Actions
            </p>
            <h2 className="mt-2 text-xl font-bold text-foreground">
              {t("quickActions")}
            </h2>
          </div>

          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.href}
                  onClick={() => router.push(action.href)}
                  className="group flex w-full items-center justify-between rounded-2xl border border-border bg-background/60 p-4 text-left transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {action.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-3xl p-5 lg:col-span-2"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Suivi
              </p>
              <h2 className="mt-2 text-xl font-bold text-foreground">
                Résumé réel
              </h2>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => router.push("/guests")}
            >
              Voir invités
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DashboardInfo
              label="Mariages créés"
              value={stats.totalWeddings}
              icon={<CalendarHeart className="h-5 w-5" />}
            />

            <DashboardInfo
              label="Groupes invités"
              value={stats.totalGuestGroups}
              icon={<Users className="h-5 w-5" />}
            />

            <DashboardInfo
              label="Présences confirmées"
              value={stats.confirmedGroups}
              icon={<UserCheck className="h-5 w-5" />}
            />

            <DashboardInfo
              label="Billets scannés"
              value={stats.checkedInGroups}
              icon={<QrCode className="h-5 w-5" />}
            />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-3xl p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Présence
              </p>
              <h2 className="mt-2 text-xl font-bold text-foreground">
                État des confirmations
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Pourcentage des groupes d’invités ayant confirmé leur présence.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UserCheck className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <ProgressRow label="Confirmés" value={stats.attendanceRate} />
            <ProgressRow label="En attente" value={pendingRate} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card rounded-3xl p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Entrées
              </p>
              <h2 className="mt-2 text-xl font-bold text-foreground">
                Contrôle des billets
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Nombre de billets déjà validés à l’entrée.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <QrCode className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-background/60 p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Total entrées validées
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats.checkedInGroups} billet(s) scanné(s)
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DashboardInfo({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-bold text-foreground">
            {value.toLocaleString("fr-FR")}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{safeValue}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}