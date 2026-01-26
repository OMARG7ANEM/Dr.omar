import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { ID, Models } from 'appwrite';
import { account } from '@/integrations/appwrite/client';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      // Simple admin check: Check if email matches the specific admin email
      // In Appwrite, we could also check 'labels' or 'teams', but for now hardcode
      setIsAdmin(currentUser.email === 'omac2461@gmail.com');
    } catch (error) {
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      await account.create(ID.unique(), email, password, fullName);
      // Auto login after sign up
      await account.createEmailPasswordSession(email, password);
      await checkUser();
      return { error: null };
    } catch (err) {
      console.error("Sign up error", err);
      return { error: err as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      await checkUser();
      return { error: null };
    } catch (err: any) {
      // If error is "creation of a session is prohibited when a session is active", just check user
      if (err.code === 401 || err.type === 'user_session_already_active') {
        await checkUser();
        return { error: null };
      }
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signUp, signIn, signOut }}>
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
