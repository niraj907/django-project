import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "budget/";

// Helper to get auth headers
const getAuthHeaders = () => {
    const accessToken = localStorage.getItem("access_token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    };
};

export const useBudgetStore = create(
    (set, get) => ({
        budgetAmount: 0,
        savingsGoal: 0,
        loading: false,
        error: null,

        // Fetch budget
        fetchBudget: async () => {
            set({ loading: true, error: null });
            try {
                const response = await axios.get(API_URL, {
                    headers: getAuthHeaders(),
                });
                set({
                    budgetAmount: response.data.amount,
                    savingsGoal: response.data.savings_goal || 0,
                    loading: false
                });
            } catch (err) {
                set({ error: err.message, loading: false });
            }
        },

        // Update budget and goal
        updateBudget: async (amount, savingsGoal) => {
            set({ loading: true, error: null });
            try {
                // Get current values from state
                const currentAmount = get().budgetAmount;
                const currentGoal = get().savingsGoal;

                // Use new values if provided, otherwise stick to current ones
                const finalAmount = amount !== undefined ? amount : currentAmount;
                const finalGoal = savingsGoal !== undefined ? savingsGoal : currentGoal;

                const response = await axios.put(API_URL, {
                    amount: finalAmount,
                    savings_goal: finalGoal
                }, {
                    headers: getAuthHeaders(),
                });

                set({
                    budgetAmount: response.data.amount,
                    savingsGoal: response.data.savings_goal,
                    loading: false
                });
            } catch (err) {
                set({ error: err.message, loading: false });
            }
        },
    }),
);
