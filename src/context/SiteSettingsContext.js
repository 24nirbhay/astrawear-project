import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const DEFAULT_SETTINGS = {
  currentThemeKey: 'default',
  allowUserThemeChoice: true,
  specialBannerText: '',
  tickerMessages: [
    'Limited Drops',
    'Built for the Streets',
    'Future-Ready Fashion',
    'Minimalist Aesthetic',
    'Custom-Made Collection',
    'Quick-Delivery',
  ],
};

const STORAGE_KEY = 'siteSettings';
const USER_THEME_PREFIX = 'userTheme_';

const SiteSettingsContext = createContext(null);

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      // ignore
    }
  }, [settings]);

  const updateSettings = (partial) => setSettings((prev) => ({ ...prev, ...partial }));

  const getUserPreferredTheme = (userId) => {
    if (!userId) return null;
    try {
      const stored = localStorage.getItem(`${USER_THEME_PREFIX}${userId}`);
      return stored || null;
    } catch {
      return null;
    }
  };

  const setUserPreferredTheme = (userId, themeKey) => {
    if (!userId) return;
    try {
      localStorage.setItem(`${USER_THEME_PREFIX}${userId}`, themeKey);
    } catch {
      // ignore
    }
  };

  const value = useMemo(
    () => ({ settings, updateSettings, getUserPreferredTheme, setUserPreferredTheme }),
    [settings]
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
};

export const useSiteSettings = () => {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  return ctx;
};
