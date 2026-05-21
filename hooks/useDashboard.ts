import { useQuery } from "@tanstack/react-query";

export type DashboardStats = {
    totalGuests: number;
    totalGuestGroups: number;
    confirmedGroups: number;
    checkedInGroups: number;
    totalWeddings: number;
    attendanceRate: number;
};

async function getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch("/api/dashboard");

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erreur dashboard");
    }

    return res.json();
}

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: getDashboardStats,
        refetchInterval: 10000,
    });
}