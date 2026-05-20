'use client'


import { useLanguage } from "@/lib/contexts/LanguageContexte";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const barData = [
  { month: "Jan", sent: 120, used: 80 },
  { month: "Feb", sent: 200, used: 150 },
  { month: "Mar", sent: 340, used: 290 },
  { month: "Apr", sent: 180, used: 140 },
  { month: "May", sent: 420, used: 380 },
  { month: "Jun", sent: 500, used: 420 },
];

const pieData = [
  { name: "Checked In", value: 342, color: "hsl(142 71% 45%)" },
  { name: "Confirmed", value: 420, color: "hsl(43 76% 52%)" },
  { name: "Invited", value: 486, color: "hsl(0 0% 30%)" },
];

export default function AnalyticsPage() {
  const { t } = useLanguage();

  return (

      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t("analytics")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-5"
          >
            <h2 className="text-sm font-semibold text-foreground mb-4">
              {t("invitationsSent")} vs {t("checkedIn")}
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <XAxis dataKey="month" tick={{ fill: "hsl(0 0% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(0 0% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)", borderRadius: "8px", color: "hsl(40 6% 90%)" }}
                />
                <Bar dataKey="sent" fill="hsl(0 0% 25%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="used" fill="hsl(43 76% 52%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-5"
          >
            <h2 className="text-sm font-semibold text-foreground mb-4">{t("attendanceRate")}</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)", borderRadius: "8px", color: "hsl(40 6% 90%)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
  );
}
