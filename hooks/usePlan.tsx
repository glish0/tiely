import { useQuery } from "@tanstack/react-query";

export type UserPlan = {
    subscription_id: string;
    user_id: string;
    status: "active" | "expired" | "cancelled" | "pending";
    billing_cycle: "monthly" | "yearly" | "one_time";
    started_at: string;
    expires_at: string | null;
    plan_id: string;
    plan_name: string;
    plan_slug: "free" | "standard" | "premium";
    price_monthly: number;
    price_yearly: number;
    currency: string;
    max_weddings: number;
    max_guests: number;
    max_tickets: number;
    can_use_qr_code: boolean;
    can_use_whatsapp: boolean;
    can_use_premium_templates: boolean;
    can_export_data: boolean;
};

async function getMyPlan(): Promise<UserPlan> {
    const res = await fetch("/api/me/plan");

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erreur lors du chargement du plan");
    }

    return res.json();
}

export function useMyPlan() {
    return useQuery({
        queryKey: ["my-plan"],
        queryFn: getMyPlan,
    });
}