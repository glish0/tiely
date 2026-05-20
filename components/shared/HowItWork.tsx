'use client'

import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Créez votre mariage", desc: "Renseignez les détails de votre événement en quelques clics." },
  { num: "02", title: "Ajoutez vos invités", desc: "Importez ou ajoutez manuellement votre liste d'invités." },
  { num: "03", title: "Générez et envoyez", desc: "Chaque invité reçoit une invitation unique avec QR code via WhatsApp." },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-28 bg-gradient-dark">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-primary text-white">Comment ça marche</span>
        <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold mt-3">
          Simple comme <span className="text-gradient-gold">1, 2, 3</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="text-center"
          >
            <div className="text-6xl font-serif font-bold text-gradient-gold opacity-40 mb-4">{s.num}</div>
            <h3 className="font-serif text-xl text-white font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-white text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
