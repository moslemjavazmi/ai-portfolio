// import { create } from "zustand";

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   email_verified: boolean;
// }

// interface AuthState {
//   user: User | null;

//   isAuthenticated: boolean;

//   isLoading: boolean;

//   setUser: (user: User) => void;

//   clearUser: () => void;

//   setLoading: (value: boolean) => void;
// }

// export const useAuthStore =
//   create<AuthState>((set) => ({

//     user: null, 

//     isAuthenticated: false,

//     isLoading: true,

//     setUser: (user) =>
//       set({
//         user,
//         isAuthenticated: true,
//         isLoading: false,
//       }),

//     clearUser: () =>
//       set({
//         user: null,
//         isAuthenticated: false,
//         isLoading: false,
//       }),

//     setLoading: (value) =>
//       set({
//         isLoading: value,
//       }),
//   }));

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;      // برای فرق گذاشتن بین "در حال بوت" و "لاگین‌نشده"
  setAuth: (user: User) => void;
  setUser: (user: User) => void;
  clear: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (user) =>
        set({ user, isAuthenticated: true }),

      setUser: (user) =>
        set({ user, isAuthenticated: true }),

      clear: () =>
        set({ user: null, isAuthenticated: false }),

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // فقط user را در localStorage نگه دار (توکن هرگز اینجا نباشد)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);