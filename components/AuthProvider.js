'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Create the AuthContext
const AuthContext = createContext({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  loading: true
});

// AuthProvider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Check active sessions and set the user
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    }

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      
      // Redirect based on auth state
      if (event === 'SIGNED_IN') {
        router.push('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    loadUser();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  // Sign in method
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
  
      if (error) {
        // Pass through the original error with code
        throw { 
          code: error.code || 'auth/error',
          message: error.message 
        };
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Throw the complete error object
    } finally {
      setLoading(false);
    }
  };

  // Sign out method
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Value to be provided to consumers
  const value = {
    user,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}