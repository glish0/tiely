import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  delay?: number;
}

export function StatCard({ title, value, icon, change, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card rounded-xl p-5 glow-gold hover:border-primary/20 transition-colors duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-muted-foreground text-sm">{title}</span>
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-gradient-gold">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {change && (
        <p className="text-xs text-success mt-1">{change}</p>
      )}
    </motion.div>
  );
}
