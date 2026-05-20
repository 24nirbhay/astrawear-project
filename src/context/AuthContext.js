import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async (currentUser) => {
    console.log('[AuthContext] checkAdminStatus triggered for user:', currentUser?.id);
    if (!currentUser) {
      console.log('[AuthContext] No user found, setting isAdmin to false');
      setIsAdmin(false);
      return;
    }
    
    try {
      console.log('[AuthContext] Fetching profile for is_admin flag...');
      const { data, error } = await supabase.from('profiles').select('is_admin').eq('id', currentUser.id).maybeSingle();
      
      if (error) console.error('[AuthContext] DB Error fetching profile:', error);
      else console.log('[AuthContext] Profile data retrieved:', data);
      
      setIsAdmin(data?.is_admin === true);
    } catch (err) {
      console.error('[AuthContext] Exception in checkAdminStatus:', err);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    console.log('[AuthContext] Mounting AuthProvider. Checking initial session...');
    
    // 1. Get current session directly from the DB on load
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) console.error('[AuthContext] Error in getSession():', error);
      console.log('[AuthContext] Initial getSession() result:', session);
      
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      checkAdminStatus(currentUser).finally(() => setLoading(false));
    });

    // 2. Listen for login/logout events directly from the DB
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log(`[AuthContext] onAuthStateChange Fired! Event: ${_event}`, session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      checkAdminStatus(currentUser);
    });

    return () => {
      console.log('[AuthContext] Unmounting AuthProvider, cleaning up subscription.');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    // Direct backend call
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    console.log('[AuthContext] Initiating Google OAuth Sign In...');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) {
        console.error('[AuthContext] Error from signInWithOAuth:', error);
        throw error;
      }
      console.log('[AuthContext] signInWithOAuth initiated successfully:', data);
      return data;
    } catch (err) {
      console.error('[AuthContext] Exception during signInWithGoogle:', err);
      throw err;
    }
  };

  const register = async (email, password) => {
    // Direct backend call
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: email.split('@')[0] // Safely defaults to the first part of their email
        }
      }
    });
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