import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAdminStatus = async (userId) => {
    try {
      const { data, error } = await supabase.from('profiles').select('is_admin').eq('id', userId).maybeSingle();
      if (error) throw error;
      return !!data?.is_admin;
    } catch (err) { 
      console.error("Admin check failed:", err);
      return false; 
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          if (mounted) setUser(session.user);
          const admin = await fetchAdminStatus(session.user.id);
          if (mounted) setIsAdmin(admin);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          if (mounted) setUser(session.user);
          const admin = await fetchAdminStatus(session.user.id);
          if (mounted) setIsAdmin(admin);
        } else {
          if (mounted) {
            setUser(null);
            setIsAdmin(false);
          }
        }
      } catch (err) {
        console.error("Auth state change error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    });

    // Safety timeout: forcefully stop loading if stuck
    const safetyTimer = setTimeout(() => {
      if (mounted && loading) setLoading(false);
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (u, p) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${u.trim().toLowerCase()}@astrawear.local`,
      password: p
    });
    if (error) throw error;
    return data;
  };

  const register = async (u, p) => {
    const { data, error } = await supabase.auth.signUp({
      email: `${u.trim().toLowerCase()}@astrawear.local`,
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