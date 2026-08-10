import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { User } from '../../domain/entities/User';

interface AuthState {
  session: Session | null;
  userProfile: User | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setUserProfile: (profile: User | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
  setGhostMode: (isGhostMode: boolean) => void;
  setPremiumStatus: (isPremium: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  userProfile: null,
  isLoading: true,
  setSession: (session) => set({ session }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  setLoading: (loading) => set({ isLoading: loading }),
  signOut: () => set({ session: null, userProfile: null }),
  setGhostMode: (isGhostMode) => set((state) => ({
    userProfile: state.userProfile ? { ...state.userProfile, isGhostMode } : null
  })),
  setPremiumStatus: (isPremium) => set((state) => ({
    userProfile: state.userProfile ? { ...state.userProfile, isPremium } : null
  })),
}));
