import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAdminStatus = async (userId) => {
    try {
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', userId).maybeSingle();
      return !!data?.is_admin;
    } catch { return false; }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const admin = await fetchAdminStatus(session.user.id);
        setIsAdmin(admin);
      }
      setLoading(false);
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const admin = await fetchAdminStatus(session.user.id);
        setIsAdmin(admin);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (u, p) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${u.toLowerCase()}@astrawear.local`,
      password: p
    });
    if (error) throw error;
    return data;
  };

  const register = async (u, p) => {
    const { data, error } = await supabase.auth.signUp({
      email: `${u.toLowerCase()}@astrawear.local`,
      password: p
    });
    if (error) throw error;
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, register, logout: () => supabase.auth.signOut() }}>
      {children}
    </AuthContext.Provider>
  );
};
