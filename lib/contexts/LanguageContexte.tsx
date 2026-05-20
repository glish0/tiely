'use client'

import React, { createContext, useContext, useState, useCallback } from "react";

type Lang = "fr" | "en";

const translations: Record<string, Record<Lang, string>> = {
  dashboard: { en: "Dashboard", fr: "Tableau de bord" },
  weddings: { en: "Weddings", fr: "Mariages" },
  guests: { en: "Guests", fr: "Invités" },
  tickets: { en: "Tickets", fr: "Billets" },
  analytics: { en: "Analytics", fr: "Analytique" },
  settings: { en: "Settings", fr: "Paramètres" },
  totalGuests: { en: "Total Guests", fr: "Total Invités" },
  invitationsSent: { en: "Invitations Sent", fr: "Invitations Envoyées" },
  checkedIn: { en: "Checked In", fr: "Enregistrés" },
  attendanceRate: { en: "Attendance Rate", fr: "Taux de Présence" },
  recentActivity: { en: "Recent Activity", fr: "Activité Récente" },
  quickActions: { en: "Quick Actions", fr: "Actions Rapides" },
  addGuest: { en: "Add Guest", fr: "Ajouter Invité" },
  generateInvitations: { en: "Generate Invitations", fr: "Générer Invitations" },
  search: { en: "Search...", fr: "Rechercher..." },
  name: { en: "Name", fr: "Nom" },
  phone: { en: "Phone", fr: "Téléphone" },
  type: { en: "Type", fr: "Type" },
  status: { en: "Status", fr: "Statut" },
  actions: { en: "Actions", fr: "Actions" },
  single: { en: "Single", fr: "Seul(e)" },
  couple: { en: "Couple", fr: "Couple" },
  invited: { en: "Invited", fr: "Invité" },
  confirmed: { en: "Confirmed", fr: "Confirmé" },
  "checked-in": { en: "Checked In", fr: "Enregistré" },
  importCsv: { en: "Import CSV", fr: "Importer CSV" },
  notifications: { en: "Notifications", fr: "Notifications" },
  profile: { en: "Profile", fr: "Profil" },
  overview: { en: "Overview", fr: "Vue d'ensemble" },
  generateTicket: { en: "Generate Ticket", fr: "Générer Billet" },
  download: { en: "Download", fr: "Télécharger" },
  used: { en: "Used", fr: "Utilisé" },
  unused: { en: "Unused", fr: "Non utilisé" },
  subscription: { en: "Subscription", fr: "Abonnement" },
  language: { en: "Language", fr: "Langue" },
  weddingCustomization: { en: "Wedding Customization", fr: "Personnalisation" },
  createWedding: { en: "Create Wedding", fr: "Créer un Mariage" },
  viewAll: { en: "View All", fr: "Voir Tout" },
};

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");
  const toggleLang = useCallback(() => setLang((l) => (l === "en" ? "fr" : "en")), []);
  const t = useCallback((key: string) => translations[key]?.[lang] ?? key, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
