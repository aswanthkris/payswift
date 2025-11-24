import { create } from "zustand";
import api from "../services/api";

const useWalletStore = create((set, get) => ({
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,

  fetchWalletData: async () => {
    set({ isLoading: true, error: null });
    try {
      const balanceRes = await api.get("/wallet");
      const transactionsRes = await api.get("/transactions");

      set({
        balance: parseFloat(balanceRes.data.balance),
        transactions: transactionsRes.data.map((t) => ({
          ...t,
          amount: parseFloat(t.amount),
        })),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch wallet data",
        isLoading: false,
      });
    }
  },

  addMoney: async (amount) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/wallet/add-money", { amount });
      set((state) => ({
        balance: parseFloat(response.data.balance),
        isLoading: false,
      }));
      get().fetchWalletData(); // Refresh transactions
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add money",
        isLoading: false,
      });
      throw error;
    }
  },

  transferMoney: async (amount, recipientEmail) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/wallet/transfer", {
        amount,
        recipientEmail,
      });
      set((state) => ({
        balance: parseFloat(response.data.balance),
        isLoading: false,
      }));
      get().fetchWalletData(); // Refresh transactions
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Transfer failed",
        isLoading: false,
      });
      return false;
    }
  },

  payBill: async (amount, serviceType) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/wallet/pay-bill", {
        amount,
        serviceType,
      });
      set((state) => ({
        balance: parseFloat(response.data.balance),
        isLoading: false,
      }));
      get().fetchWalletData(); // Refresh transactions
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Payment failed",
        isLoading: false,
      });
      return false;
    }
  },

  validateRecipient: async (email) => {
    try {
      const response = await api.post("/wallet/validate-recipient", { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  beneficiaries: [],

  fetchBeneficiaries: async () => {
    try {
      const response = await api.get("/beneficiaries");
      set({ beneficiaries: response.data });
    } catch (error) {
      console.error("Failed to fetch beneficiaries:", error);
    }
  },

  addBeneficiary: async (email, nickname) => {
    try {
      const response = await api.post("/beneficiaries", { email, nickname });
      set((state) => ({
        beneficiaries: [...state.beneficiaries, response.data],
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add beneficiary",
      });
      return false;
    }
  },

  deleteBeneficiary: async (id) => {
    try {
      await api.delete(`/beneficiaries/${id}`);
      set((state) => ({
        beneficiaries: state.beneficiaries.filter((b) => b.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete beneficiary:", error);
    }
  },

  analyticsData: null,

  fetchAnalytics: async () => {
    try {
      const response = await api.get("/analytics");
      set({ analyticsData: response.data });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  },
}));

export default useWalletStore;
