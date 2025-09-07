import { create } from "zustand";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/categories/";

export const useCategoryStore = create(
    (set, get) => ({
      categories: [],
      loading: false,
      error: null,

      // Fetch all categories
      fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(API_URL);
          set({ categories: response.data, loading: false });
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      // Add a new category
      createCategory: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(API_URL, data, {
            headers: { "Content-Type": "application/json" },
          });
          set({ categories: [response.data, ...get().categories], loading: false });
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      // Update a category
      updateCategory: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.put(`${API_URL}${id}/`, data, {
            headers: { "Content-Type": "application/json" },
          });
          set({
            categories: get().categories.map((cat) =>
              cat.id === id ? response.data : cat
            ),
            loading: false,
          });
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      // Delete a category
      deleteCategory: async (id) => {
        set({ loading: true, error: null });
        try {
          await axios.delete(`${API_URL}${id}/`);
          set({
            categories: get().categories.filter((cat) => cat.id !== id),
            loading: false,
          });
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },
    }),
);


