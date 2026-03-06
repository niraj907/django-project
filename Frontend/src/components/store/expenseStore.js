import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "expenses/";

// Helper to get auth headers
const getAuthHeaders = () => {
    const accessToken = localStorage.getItem("access_token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    };
};

export const useExpenseStore = create(
    (set, get) => ({
        expenses: [],
        loading: false,
        error: null,

        // Fetch only the logged-in user's expenses
        fetchExpenses: async (categoryId = null) => {
            set({ loading: true, error: null });
            try {
                const url = categoryId ? `${API_URL}?category=${categoryId}` : API_URL;
                const response = await axios.get(url, {
                    headers: getAuthHeaders(),
                });
                set({ expenses: response.data, loading: false });
            } catch (err) {
                set({ error: err.message, loading: false });
            }
        },

        // Add a new expense
        createExpense: async (data) => {
            set({ loading: true, error: null });
            try {
                const response = await axios.post(API_URL, data, {
                    headers: getAuthHeaders(),
                });
                set({ expenses: [response.data, ...get().expenses], loading: false });
            } catch (err) {
                set({ error: err.message, loading: false });
            }
        },

        // Update an expense
        updateExpense: async (id, data) => {
            set({ loading: true, error: null });
            try {
                const response = await axios.put(`${API_URL}${id}/`, data, {
                    headers: getAuthHeaders(),
                });
                set({
                    expenses: get().expenses.map((exp) =>
                        exp.id === id ? response.data : exp
                    ),
                    loading: false,
                });
            } catch (err) {
                set({ error: err.message, loading: false });
            }
        },

        // Delete an expense
        deleteExpense: async (id) => {
            set({ loading: true, error: null });
            try {
                await axios.delete(`${API_URL}${id}/`, {
                    headers: getAuthHeaders(),
                });
                set({
                    expenses: get().expenses.filter((exp) => exp.id !== id),
                    loading: false,
                });
            } catch (err) {
                set({ error: err.message, loading: false });
            }
        },
    }),
);
