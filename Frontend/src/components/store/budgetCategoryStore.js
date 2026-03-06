import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "budget-categories/";

const getAuthHeaders = () => {
    const accessToken = localStorage.getItem("access_token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    };
};

export const useBudgetCategoryStore = create(
    (set, get) => ({
        budgetCategories: [],
        loading: false,
        error: null,

        fetchBudgetCategories: async () => {
            set({ loading: true, error: null });
            try {
                const response = await axios.get(API_URL, {
                    headers: getAuthHeaders(),
                });
                set({ budgetCategories: response.data, loading: false });
            } catch (err) {
                set({ error: err.message, loading: false });
            }
        },

        createBudgetCategory: async (data) => {
            set({ loading: true, error: null });
            try {
                const response = await axios.post(API_URL, data, {
                    headers: getAuthHeaders(),
                });
                set({
                    budgetCategories: [response.data, ...get().budgetCategories],
                    loading: false,
                });
                return response.data;
            } catch (err) {
                set({ error: err.message, loading: false });
                throw err;
            }
        },

        updateBudgetCategory: async (id, data) => {
            set({ loading: true, error: null });
            try {
                const response = await axios.put(`${API_URL}${id}/`, data, {
                    headers: getAuthHeaders(),
                });
                set({
                    budgetCategories: get().budgetCategories.map((item) =>
                        item.id === id ? response.data : item
                    ),
                    loading: false,
                });
                return response.data;
            } catch (err) {
                set({ error: err.message, loading: false });
                throw err;
            }
        },

        deleteBudgetCategory: async (id) => {
            set({ loading: true, error: null });
            try {
                await axios.delete(`${API_URL}${id}/`, {
                    headers: getAuthHeaders(),
                });
                set({
                    budgetCategories: get().budgetCategories.filter((item) => item.id !== id),
                    loading: false,
                });
            } catch (err) {
                set({ error: err.message, loading: false });
                throw err;
            }
        },
    })
);
