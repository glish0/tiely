'use client'

import { Users, Send, UserCheck, TrendingUp, Plus, Ticket } from "lucide-react";

import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContexte";
import { StatCard } from "@/components/StatCard";
import { useRouter } from "next/navigation";

const recentActivity = [
  { id: 1, text: "Amara Diallo confirmed attendance", time: "2 min ago" },
  { id: 2, text: "Kofi Mensah checked in", time: "15 min ago" },
  { id: 3, text: "50 invitations sent via WhatsApp", time: "1 hour ago" },
  { id: 4, text: "New wedding created: Ade & Binta", time: "3 hours ago" },
];

export default function DashboardHome() {
  const { t } = useLanguage();
  const navigate = useRouter();

  return (
  
      <div className="max-w-6xl mx-auto space-y-8 ">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("overview")}</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back to Tiely</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={t("totalGuests")} value="1,248" icon={<Users className="h-5 w-5" />} change="+12% this week" delay={0} />
          <StatCard title={t("invitationsSent")} value="986" icon={<Send className="h-5 w-5" />} change="+8% this week" delay={0.1} />
          <StatCard title={t("checkedIn")} value="342" icon={<UserCheck className="h-5 w-5" />} change="+24% today" delay={0.2} />
          <StatCard title={t("attendanceRate")} value="87%" icon={<TrendingUp className="h-5 w-5" />} change="+3%" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-5"
          >
            <h2 className="text-sm font-semibold text-foreground mb-4">{t("quickActions")}</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate.push("/guests")}>
                <Plus className="h-4 w-4" /> {t("addGuest")}
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-2" onClick={() => navigate.push("/tickets")}>
                <Ticket className="h-4 w-4" /> {t("generateInvitations")}
              </Button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 glass-card rounded-xl p-5"
          >
            <h2 className="text-sm font-semibold text-foreground mb-4">{t("recentActivity")}</h2>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{item.text}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
   
  );
}
