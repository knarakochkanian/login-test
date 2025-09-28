import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name?: string;
  requires2FA?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  show2FA: boolean;
  twoFAError: string;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setShow2FA: (show: boolean) => void;
  setTwoFAError: (error: string) => void;
  login: (user: User) => void;
  logout: () => void;
  reset2FA: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      show2FA: false,
      twoFAError: '',

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user && !user.requires2FA,
        show2FA: !!user?.requires2FA
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setShow2FA: (show2FA) => set({ show2FA }),
      
      setTwoFAError: (twoFAError) => set({ twoFAError }),
      
      login: (user) => set({ 
        user, 
        isAuthenticated: !user.requires2FA,
        show2FA: !!user.requires2FA,
        twoFAError: ''
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        show2FA: false, 
        twoFAError: '' 
      }),
      
      reset2FA: () => set({ 
        show2FA: false, 
        twoFAError: '' 
      }),
      
      clearError: () => set({ twoFAError: '' }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
