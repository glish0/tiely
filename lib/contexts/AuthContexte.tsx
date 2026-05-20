// contexts/AuthContext.tsx
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    telephone: string
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()



 useEffect(() => {
  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    setUser(session?.user ?? null);
    setIsLoading(false); // 🔥 IMPORTANT
  };

  getSession();

  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {

      setUser(session?.user ?? null);
      setIsLoading(false); // 🔥 IMPORTANT
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);

  // ✅ SIGN UP
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    telephone: string
  ): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          telephone: telephone,
        },
      },
    });

    return { error };
  };

  // ✅ SIGN IN
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: AuthError | null }> => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data?.user) {
      setUser(data.user);
    }

    setIsLoading(false);

    return { error };
  };

  const signInWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
};

  // ✅ SIGN OUT
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/')
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Hook sécurisé
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
