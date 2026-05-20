'use client'

import { Button } from "@/components/ui/button";
import { Plus, MapPin, Calendar, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContexte";
import { WeddingFormModal } from "@/components/form/WeddingsFormModal";
import { useWyWedding } from "@/hooks/useWedding";
import { useAuth } from "@/lib/contexts/AuthContexte";


const weddings = [
  { id: 1, name: "Ade & Binta", date: "June 15, 2026", location: "Lagos, Nigeria", guests: 320 },
  { id: 2, name: "Kofi & Ama", date: "August 22, 2026", location: "Accra, Ghana", guests: 180 },
  { id: 3, name: "Moussa & Fatou", date: "October 5, 2026", location: "Abidjan, Côte d'Ivoire", guests: 450 },
];

export default function WeddingsPage() {

  const {user} = useAuth()
  const { t } = useLanguage();


  const { data: weddings, isLoading, error } = useWyWedding(user?.id);

  if(!user) return <p>Loading...</p>;

  return (
    
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t("weddings")}</h1>
          <WeddingFormModal
          trigger={
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              {t("createWedding")}
            </Button>
          }
        />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weddings ? weddings.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-5 hover:border-primary/20 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{w.groom} {w.bride} </h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" /> {w.event_date}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" /> {w.venue}
                </div>
               {/*  <div className="flex items-center gap-2">
                  <span className="text-primary font-medium">{w.guests}</span> t("guests").toLowerCase()
                </div> */}
              </div>
            </motion.div>
          )) : <p>Loading...</p>}
        </div>
      </div>
   
  );
}
