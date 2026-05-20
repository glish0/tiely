'use client'

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
    {/* Ambient glow */}
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

    <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
      {/* Copy */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col gap-6"
      >
        <span className="inline-flex items-center gap-2 glass-gold rounded-full px-4 py-1.5 text-xs font-medium text-primary w-fit">
          ✨ Plateforme #1 d&apos;invitations digitales en Afrique
        </span>
       

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-5xl font-bold leading-tight">
          Créez des invitations de mariage{" "}
          <span className="text-gradient-gold">uniques et modernes</span> avec Tiely
        </h1>

        <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
          Des invitations digitales élégantes avec QR code unique pour chaque invité.
          Simplifiez la gestion de vos invités et impressionnez-les.
        </p>

        <div className="flex flex-wrap gap-4 mt-2">
          <Link
            href="/login"
            className="bg-gradient-gold rounded-full px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-105"
          >
            Générer mes invitations
          </Link>
          <a
            href="#features"
            className="glass-gold rounded-full px-8 py-3.5 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            Essayer gratuitement
          </a>
        </div>

        <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" /> QR Code unique
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" /> Check-in en temps réel
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" /> Partage WhatsApp
          </span>
        </div>
      </motion.div>

      {/* Phone mockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex justify-center lg:justify-end"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full" />
          <Image
            src={'/assets/hero-phone.png'}
            alt="Tiely - Invitation digitale avec QR code"
            width={420}
            height={540}
              style={{ height: "auto" }}
            className="relative z-10 drop-shadow-2xl animate-float"
          />
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
