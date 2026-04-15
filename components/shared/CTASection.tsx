import { motion } from "framer-motion";

const CTASection = () => (
  <section id="cta" className="py-28 relative overflow-hidden">
    <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full mx-auto w-[600px] h-[400px] top-1/2 -translate-y-1/2" />

    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto"
      >
        <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
          Transformez votre mariage en une expérience{" "}
          <span className="text-gradient-gold">moderne et élégante</span>
        </h2>
        <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
          Rejoignez des centaines de couples qui ont choisi Tiely pour créer des invitations inoubliables.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <a
            href="#"
            className="bg-gradient-gold rounded-full px-10 py-4 text-base font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-105"
          >
            Générer mes invitations
          </a>
          <a
            href="#pricing"
            className="glass-gold rounded-full px-10 py-4 text-base font-semibold text-primary transition hover:bg-primary/10"
          >
            Voir les tarifs
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
