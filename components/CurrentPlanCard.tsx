"use client";

import { useMyPlan } from "@/hooks/usePlan";


export function CurrentPlanCard() {
    const { data: plan, isLoading } = useMyPlan();

    if (isLoading) {
        return <div>Chargement du plan...</div>;
    }

    if (!plan) {
        return <div>Aucun plan actif</div>;
    }

    return (
        <div className="glass-card rounded-3xl p-5">
            <p className="text-sm text-muted-foreground">Plan actuel</p>

            <h2 className="mt-2 text-2xl font-bold text-foreground">
                {plan.plan_name}
            </h2>

            <div className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Mariages</span>
                    <span>{plan.max_weddings}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">Invités</span>
                    <span>{plan.max_guests}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">Billets</span>
                    <span>{plan.max_tickets}</span>
                </div>
            </div>
        </div>
    );
}