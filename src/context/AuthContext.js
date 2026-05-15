import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          const { data, error } = await supabase.from('profiles').select('is_admin').eq('id', currentUser.id).single();
          if (!error) setIsAdmin(data?.is_admin || false);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const { data } = await supabase.from('profiles').select('is_admin').eq('id', currentUser.id).single();
        setIsAdmin(data?.is_admin || false);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      loading, 
      login: (u, p) => supabase.auth.signInWithPassword({ email: `${u.toLowerCase()}@astrawear.local`, password: p }),
      register: (u, p) => supabase.auth.signUp({ email: `${u.toLowerCase()}@astrawear.local`, password: p }),
      logout: () => supabase.auth.signOut() 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
