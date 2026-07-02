'use client'

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Gratuit",
    price: "0 FCFA",
    desc: "Pour découvrir Tiely",
    features: ["Jusqu'à 10 invitations", "1 modèle de base", "Partage WhatsApp", "QR code standard"],
    highlighted: false,
  },
  {
    name: "Standard",
    price: "25 000 FCFA",
    desc: "Le plus populaire",
    features: [
      "Jusqu'à 150 invitations",
      "Jusqu'à 5 modèles",
      "Check-in en temps réel",
      "Analytiques complètes",
      "Partage WhatsApp illimité",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "35 000 FCFA",
    desc: "Pour les grands événements",
    features: [
      "Invitations illimitées",
      "Modèles premium exclusifs",
      "Support prioritaire",
      "Analytiques avancées",
      "Check-in multi-entrée",
      "Personnalisation complète",
    ],
    highlighted: false,
  },
];

const PricingSection = () => (
  <section id="pricing" className="py-28">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Tarifs</span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3">
          Un plan pour <span className="text-gradient-gold">chaque mariage</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Choisissez le plan qui correspond à votre événement. Sans engagement.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`rounded-2xl p-8 flex flex-col ${p.highlighted
              ? "glass-gold glow-gold ring-1 ring-primary/30 scale-[1.02]"
              : "glass"
              }`}
          >
            {p.highlighted && (
              <span className="bg-gradient-gold text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1 self-start mb-4">
                Plus populaire
              </span>
            )}
            <h3 className="font-serif text-2xl font-bold">{p.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
            <div className="mt-6 mb-8">
              <span className="text-3xl font-bold text-gradient-gold">{p.price}</span>
            </div>
            <ul className="flex flex-col gap-3 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-secondary-foreground">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#cta"
              className={`mt-8 rounded-full py-3 text-center text-sm font-semibold transition-transform hover:scale-105 ${p.highlighted
                ? "bg-gradient-gold text-primary-foreground shadow-gold"
                : "glass-gold text-primary hover:bg-primary/10"
                }`}
            >
              Commencer
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
