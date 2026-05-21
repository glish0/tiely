"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Globe,
  CreditCard,
  Loader2,
  CheckCircle2,
  Crown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContexte";
import { useMyPlan } from "@/hooks/usePlan";


const plans = [
  {
    slug: "free",
    name: "Free",
    price: "0 FCFA",
    features: ["10 invités", "1 mariage", "Templates basiques", "QR Code"],
  },
  {
    slug: "standard",
    name: "Standard",
    price: "15,000 FCFA",
    features: ["150 invités", "1 mariage", "QR tickets", "Partage WhatsApp"],
  },
  {
    slug: "premium",
    name: "Premium",
    price: "25,000 FCFA",
    features: [
      "500 invités",
      "3 mariages",
      "Templates premium",
      "Export des données",
    ],
  },
] as const;

export default function SettingsPage() {
  const { t, lang, toggleLang } = useLanguage();
  const { data: currentPlan, isLoading: isPlanLoading } = useMyPlan();

  const sections = [
    {
      icon: <User className="h-5 w-5" />,
      title: t("profile"),
      content: (
        <div className="space-y-4">
          <div>
            <Label>{t("name")}</Label>
            <Input defaultValue="Ade Okafor" className="mt-1" />
          </div>

          <div>
            <Label>Email</Label>
            <Input defaultValue="ade@tiely.app" className="mt-1" />
          </div>

          <Button variant="outline" size="sm">
            Save
          </Button>
        </div>
      ),
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: t("language"),
      content: (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {lang === "en" ? "English" : "Français"}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">EN</span>
            <Switch checked={lang === "fr"} onCheckedChange={toggleLang} />
            <span className="text-xs text-muted-foreground">FR</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Tieli
        </p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">
          {t("settings")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gérez votre profil, la langue et votre abonnement.
        </p>
      </div>

      {sections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {section.icon}
            </div>

            <h2 className="font-semibold text-foreground">{section.title}</h2>
          </div>

          {section.content}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-5"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CreditCard className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-foreground">
                {t("subscription")}
              </h2>
              <p className="text-sm text-muted-foreground">
                Votre plan actuel et les offres disponibles.
              </p>
            </div>
          </div>

          {isPlanLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement...
            </div>
          )}
        </div>

        {currentPlan && (
          <div className="mb-5 rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Plan actuel</p>
                <h3 className="mt-1 flex items-center gap-2 text-xl font-bold text-foreground">
                  <Crown className="h-5 w-5 text-primary" />
                  {currentPlan.plan_name}
                </h3>
              </div>

              <Badge className="border-primary/20 bg-primary/15 text-primary">
                {currentPlan.status === "active" ? "Actif" : currentPlan.status}
              </Badge>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <PlanLimitCard
                label="Mariages"
                value={currentPlan.max_weddings}
              />
              <PlanLimitCard label="Invités" value={currentPlan.max_guests} />
              <PlanLimitCard label="Billets" value={currentPlan.max_tickets} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = currentPlan?.plan_slug === plan.slug;

            return (
              <div
                key={plan.slug}
                className={`rounded-2xl border p-4 transition-colors ${isCurrent
                    ? "border-primary bg-primary/5 shadow-gold"
                    : "border-border hover:border-primary/30"
                  }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    {plan.name}
                  </h3>

                  {isCurrent && (
                    <Badge className="border-primary/20 bg-primary/15 text-xs text-primary">
                      Current
                    </Badge>
                  )}
                </div>

                <p className="mb-3 text-lg font-bold text-primary">
                  {plan.price}
                </p>

                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-4 w-full"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent}
                >
                  {isCurrent ? "Plan actuel" : "Choisir ce plan"}
                </Button>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function PlanLimitCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold text-foreground">
        {value.toLocaleString("fr-FR")}
      </p>
    </div>
  );
}