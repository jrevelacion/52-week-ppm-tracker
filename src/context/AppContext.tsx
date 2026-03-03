import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, User, WeeklyStats } from '@/types';
import apiClient from '@/lib/api';

interface AppContextType {
  company: Company | null;
  user: User | null;
  weeklyStats: WeeklyStats | null;
  loading: boolean;
  error: string | null;
  setCompany: (company: Company | null) => void;
  setUser: (user: User | null) => void;
  refreshStats: () => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const refreshStats = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await apiClient.get(`/stats/weekly`);
      setWeeklyStats(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
    setWeeklyStats(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AppContext.Provider
      value={{
        company,
        user,
        weeklyStats,
        loading,
        error,
        setCompany,
        setUser,
        refreshStats,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
