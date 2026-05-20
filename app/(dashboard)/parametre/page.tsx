'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { User, Globe, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContexte";

const plans = [
  { name: "Free", price: "0 FCFA", features: ["50 guests", "1 wedding", "Basic templates"], current: false },
  { name: "Standard", price: "15,000 FCFA", features: ["500 guests", "3 weddings", "QR tickets", "WhatsApp share"], current: true },
  { name: "Premium", price: "25,000 FCFA", features: ["Unlimited guests", "Unlimited weddings", "Analytics", "Priority support"], current: false },
];

export default function SettingsPage() {
  const { t, lang, toggleLang } = useLanguage();

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
          <Button variant="outline" size="sm">Save</Button>
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
   
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t("settings")}</h1>

        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {section.icon}
              </div>
              <h2 className="font-semibold text-foreground">{section.title}</h2>
            </div>
            {section.content}
          </motion.div>
        ))}

        {/* Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <CreditCard className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-foreground">{t("subscription")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-4 border transition-colors ${
                  plan.current ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{plan.name}</h3>
                  {plan.current && <Badge className="bg-primary/15 text-primary border-primary/20 text-xs">Current</Badge>}
                </div>
                <p className="text-lg font-bold text-primary mb-3">{plan.price}</p>
                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-muted-foreground">• {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
   
  );
}
