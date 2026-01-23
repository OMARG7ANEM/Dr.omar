import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      return !!data;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const adminStatus = await checkAdminRole(session.user.id);
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }

        setLoading(false);
      }
    );

    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const adminStatus = await checkAdminRole(session.user.id);
        setIsAdmin(adminStatus);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs = 60000): Promise<T> => {
    let timeoutHandle: ReturnType<typeof setTimeout>;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => reject(new Error('Request timed out. Please check your internet connection or firewall settings.')), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutHandle));
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await withTimeout(supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: fullName,
          },
        },
      }));
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await withTimeout(supabase.auth.signInWithPassword({
        email,
        password,
      }));
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      await withTimeout(supabase.auth.signOut());
      setIsAdmin(false);
    } catch (error) {
      console.error("Sign out error:", error);
      // Force local cleanup anyway
      localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token');
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
