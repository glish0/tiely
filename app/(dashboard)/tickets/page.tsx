'use client'

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ticket, Download, Share2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContexte";

const tickets = [
  { id: "TK-001", guest: "Amara Diallo", status: "unused" as const, code: "ADWED2026" },
  { id: "TK-002", guest: "Kofi & Ama Mensah", status: "used" as const, code: "KMWED2026" },
  { id: "TK-003", guest: "Fatou Sow", status: "unused" as const, code: "FSWED2026" },
  { id: "TK-004", guest: "Chinwe Okafor", status: "unused" as const, code: "COWED2026" },
  { id: "TK-005", guest: "Moussa & Aïcha Traoré", status: "used" as const, code: "MTWED2026" },
  { id: "TK-006", guest: "Binta Bah", status: "unused" as const, code: "BBWED2026" },
];

export default function TicketsPage() {
  const { t } = useLanguage();

  return (
  
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t("tickets")}</h1>
          <Button variant="default" size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> {t("generateTicket")}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket, i) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-5 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-mono">{ticket.id}</span>
                <Badge className={`text-xs border ${
                  ticket.status === "unused"
                    ? "bg-success/15 text-success border-success/20"
                    : "bg-destructive/15 text-destructive border-destructive/20"
                }`}>
                  {t(ticket.status)}
                </Badge>
              </div>
              <h3 className="font-medium text-foreground mb-2">{ticket.guest}</h3>
              {/* QR placeholder */}
              <div className="w-full aspect-square max-w-[120px] mx-auto my-4 bg-secondary rounded-lg flex items-center justify-center border border-border">
                <Ticket className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-center text-xs text-muted-foreground font-mono mb-4">{ticket.code}</p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1 gap-1 text-xs">
                  <Download className="h-3 w-3" /> {t("download")}
                </Button>
                <Button variant="secondary" size="sm" className="flex-1 gap-1 text-xs">
                  <Share2 className="h-3 w-3" /> WhatsApp
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
   
  );
}
