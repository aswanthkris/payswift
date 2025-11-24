import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isKYCVerified: false,
      isLoading: false,
      error: null,

      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/signup', userData);
          const { user, token, ...rest } = response.data;
          // Backend returns: id, name, email, token. 
          // We need to construct the user object.
          const newUser = { id: rest.id, name: rest.name, email: rest.email };
          
          set({ 
            user: newUser, 
            token: token, 
            isAuthenticated: true, 
            isKYCVerified: false, 
            isLoading: false 
          });
          return newUser;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Signup failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, kyc_verified, ...user } = response.data;
          
          set({ 
            user: user, 
            token: token, 
            isAuthenticated: true, 
            isKYCVerified: kyc_verified, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Login failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      completeKYC: async (kycData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/kyc', kycData);
          const { kyc_verified } = response.data;
          
          set((state) => ({
            user: { ...state.user, kyc_verified },
            isKYCVerified: true,
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'KYC failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        isKYCVerified: false,
        error: null 
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated, 
        isKYCVerified: state.isKYCVerified 
      }),
    }
  )
);

export default useAuthStore;
