import { create } from "zustand";
import { actionLogin } from "../api/auth";
import { persist } from 'zustand/middleware';

const authStore = (set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  actionLoginWithZustand: async (value) => {
    try {
      const res = await actionLogin(value);
      const { user, token } = res.data;
      set({
        token,
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'ADMIN',
      });
      return { success: true, role: user.role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },
  logout: () => set({ token: null, user: null, isAuthenticated: false, isAdmin: false }),
  setUser: (user) => set((state) => ({
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  })),
});

const useAuthStore = create(
  persist(authStore, { name: "auth-store" })
);

export default useAuthStore;