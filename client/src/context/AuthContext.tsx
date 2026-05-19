'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '../models/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Strict Client Route Guard Logic (Direct LocalStorage Sync)
  useEffect(() => {
    if (!loading) {
      // State sync hone ka wait nahi karenge, direct localStorage se current token uthayenge
      const currentToken = token || localStorage.getItem('token');
      
      const isDashboardRoute = 
        pathname?.startsWith('/dashboard') || 
        pathname === '/ai' || 
        pathname === '/analytics' || 
        pathname === '/calendar' || 
        pathname === '/notifications';

      if (isDashboardRoute && !currentToken) {
        // Agar dashboard par h aur token nahi mila, toh login par pheko
        router.push('/login');
      } else if ((pathname === '/login' || pathname === '/register') && currentToken) {
        // Agar login par h aur token mil gya, toh straight dashboard pe bhejo
        router.push('/dashboard');
      }
    }
  }, [token, pathname, loading, router]);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    
    // Instant programmatic navigation force trigger
    router.replace('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {loading && pathname !== '/' ? (
        <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-3">
          <div className="h-6 w-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-xs text-gray-500 font-medium">Syncing Secure Environment...</span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};