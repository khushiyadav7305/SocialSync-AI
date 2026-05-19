'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Sparkles, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut 
} from 'lucide-react';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Content Scheduler', href: '/dashboard/schedule', icon: Calendar },
    { name: 'AI Generator', href: '/ai', icon: Sparkles },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#030712] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B0F19] border-r border-gray-800 flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              SocialSync AI 🚀
            </span>
          </div>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer profile section inside sidebar */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-gray-900/20">
          <div className="flex flex-col truncate max-w-[150px]">
            <span className="text-sm font-medium text-gray-200 truncate">{user?.name || 'User'}</span>
            <span className="text-xs text-gray-500 truncate">{user?.email || 'SaaS Account'}</span>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Dashboard Framework */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#030712]">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#0B0F19]/50 backdrop-blur-md sticky top-0 z-50">
          <h1 className="text-lg font-semibold text-gray-200">
            {navigation.find(nav => nav.href === pathname)?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-medium border border-emerald-500/20">
              Production Environment Stable
            </span>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}