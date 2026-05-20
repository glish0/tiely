'use client'

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Comment fonctionnent les invitations QR code ?",
    a: "Chaque invité reçoit une invitation digitale avec un QR code unique. Ce code contient les informations de l'événement et peut être scanné à l'entrée pour le check-in.",
  },
  {
    q: "Puis-je envoyer les invitations via WhatsApp ?",
    a: "Oui ! Tiely est conçu pour l'Afrique. Vous pouvez envoyer les invitations directement via WhatsApp en un clic. Vos invités reçoivent un lien élégant avec leur invitation personnalisée.",
  },
  {
    q: "Comment suivre la présence de mes invités ?",
    a: "Le tableau de bord vous montre en temps réel qui a confirmé, qui a consulté l'invitation et qui est présent le jour J grâce au scan QR à l'entrée.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Absolument. Toutes les données sont chiffrées et hébergées sur des serveurs sécurisés. Chaque QR code est unique et ne peut être utilisé que par l'invité désigné.",
  },
  {
    q: "Puis-je personnaliser mes invitations ?",
    a: "Oui, Tiely propose des templates élégants que vous pouvez personnaliser avec vos couleurs, photos et textes. Les plans Standard et Premium offrent encore plus d'options.",
  },
];

const FAQSection = () => (
  <section id="faq" className="py-28 bg-gradient-dark">
    <div className="container mx-auto px-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-primary text-white">FAQ</span>
        <h2 className="font-serif text-3xl text-white sm:text-4xl font-bold mt-3">
          Questions <span className="text-gradient-gold">fréquentes</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="text-white rounded-xl px-6 border-none"
            >
              <AccordionTrigger className="font-serif text-left text-base font-semibold hover:no-underline hover:text-primary py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FAQSection;
