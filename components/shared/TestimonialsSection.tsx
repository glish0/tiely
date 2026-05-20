'use client'

import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Christelle & Patrick",
    location: "Douala, Cameroun",
    text: "Tiely a transformé notre mariage ! Nos invités étaient impressionnés par les invitations digitales. Le check-in à l'entrée était fluide et professionnel.",
  },
  {
    name: "Aminata & Ibrahim",
    location: "Yaoundé, Cameroun",
    text: "Simple, élégant et efficace. On a pu gérer 200 invités sans stress. Le partage WhatsApp a été un vrai game-changer pour nous.",
  },
  {
    name: "Sandrine & Jean-Marc",
    location: "Abidjan, Côte d'Ivoire",
    text: "Je recommande Tiely à tous les couples. L'expérience est premium et le support est excellent. Nos invités en parlent encore !",
  },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="py-28 relative overflow-hidden">
    {/* Background image */}
    <div className="absolute inset-0 opacity-[0.07]">
      <Image src={'/assets/wedding-couple.jpg'} alt="" className="w-full h-full object-cover" loading="lazy" width={1280} height={720} />
    </div>
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Témoignages</span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3">
          Ils ont choisi <span className="text-gradient-gold">Tiely</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass-gold rounded-2xl p-8"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <span key={j} className="text-primary text-sm">★</span>
              ))}
            </div>
            <p className="text-sm text-secondary-foreground leading-relaxed italic mb-6">&quot;{t.text}&quot;</p>
            <div>
              <p className="font-serif font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
