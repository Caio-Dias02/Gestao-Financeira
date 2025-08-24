import { api } from "@/lib/api";

export const gerDashboardSummary = async () => {
    const response = await api.get("/dashboard/summary");
    return response.data;
}

export const getRecentTransactions = async (limit: number = 10) => {
    const response = await api.get(`/dashboard/recent-transactions?limit=${limit}`);
    return response.data;
}

export const getMonthlyTrends = async (months: number = 6) => {
    const response = await api.get(`/dashboard/monthly-trends?months=${months}`);
    return response.data;
}
