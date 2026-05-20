'use client'

import { motion } from "framer-motion";
import { QrCode, Users, ScanLine, Palette, MessageCircle, BarChart3 } from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "Invitations QR Code",
    desc: "Chaque invité reçoit un QR code unique et sécurisé pour accéder aux détails de l'événement.",
  },
  {
    icon: Users,
    title: "Gestion des invités",
    desc: "Tableau de bord complet pour gérer, suivre et organiser tous vos invités facilement.",
  },
  {
    icon: ScanLine,
    title: "Check-in en temps réel",
    desc: "Scannez les QR codes à l'entrée pour un check-in rapide et professionnel.",
  },
  {
    icon: Palette,
    title: "Templates élégants",
    desc: "Des modèles d'invitation modernes et personnalisables pour refléter votre style.",
  },
  {
    icon: MessageCircle,
    title: "Partage WhatsApp",
    desc: "Envoyez vos invitations directement via WhatsApp — simple et adapté à l'Afrique.",
  },
  {
    icon: BarChart3,
    title: "Analytiques détaillées",
    desc: "Suivez les confirmations, les présences et les statistiques en un coup d'œil.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => (
  <section id="features" className="py-28">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Fonctionnalités</span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3">
          Tout ce dont vous avez besoin pour un <span className="text-gradient-gold">mariage parfait</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Une plateforme complète pour créer, envoyer et gérer vos invitations digitales avec élégance.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            className="group glass-gold rounded-2xl p-8 transition-all hover:glow-gold"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default FeaturesSection;
