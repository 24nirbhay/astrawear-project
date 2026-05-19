import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async (currentUser) => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }
    const { data } = await supabase.from('profiles').select('is_admin').eq('id', currentUser.id).maybeSingle();
    setIsAdmin(data?.is_admin === true);
  };

  useEffect(() => {
    // 1. Get current session directly from the DB on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      checkAdminStatus(currentUser).finally(() => setLoading(false));
    });

    // 2. Listen for login/logout events directly from the DB
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      checkAdminStatus(currentUser);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    // Direct backend call
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    if (error) throw error;
    return data;
  };

  const register = async (email, password) => {
    // Direct backend call
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    // Direct backend call
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, register, logout, signInWithGoogle }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};