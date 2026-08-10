import { supabase } from './supabase';
import { useAuthStore } from '../../app/stores/useAuthStore';

export class AuthService {
  static async initialize() {
    useAuthStore.getState().setLoading(true);
    const { data: { session }, error } = await supabase.auth.getSession();

    if (session) {
      useAuthStore.getState().setSession(session);
      // Here you would typically fetch the user profile from your 'users' table
      // and call setUserProfile
    }

    useAuthStore.getState().setLoading(false);

    supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState().setSession(session);
      if (!session) {
        useAuthStore.getState().setUserProfile(null);
      }
    });
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  static async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) throw error;
    return data;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    useAuthStore.getState().signOut();
  }
}
