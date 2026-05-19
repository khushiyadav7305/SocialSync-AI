'use client';
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Shield, Sliders, Save, HardDrive } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [profileName, setProfileName] = useState(user?.name || '');
  const [theme, setTheme] = useState('dark');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // SaaS save action simulation mock
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Configuration profiles synchronized successfully! ⚙️');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Profile General Management Form Panel */}
        <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <User className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-gray-200">Account Identity Profiles</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#030712] border border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-200 text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Registered Email Address Address Address Address</label>
              <input
                type="email"
                disabled
                value={user?.email || 'admin@socialsync.ai'}
                className="w-full px-4 py-2.5 bg-[#030712]/50 border border-gray-800/80 rounded-xl text-gray-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Global SaaS Options Customizers Controls Toggles */}
        <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <Sliders className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-gray-200">SaaS Platform Controls</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Visual Interface Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#030712] border border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-300 text-sm transition-colors"
              >
                <option value="dark">Production Dark Mode (Default)</option>
                <option value="light" disabled>Light Mode (Enterprise Feature Upgrade Only)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">BullMQ Worker Pull Interval</label>
              <input
                type="text"
                disabled
                placeholder="Real-Time Event Driven (Socket Mode Active)"
                className="w-full px-4 py-2.5 bg-[#030712]/50 border border-gray-800/80 rounded-xl text-gray-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Security / Architecture Specs Matrix Informatives */}
        <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 mt-0.5">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-200">Security Layers Sync Status</h4>
              <p className="text-xs text-gray-500 mt-0.5">All authentication routines are signed via stateless cryptographically protected JSON Web Tokens.</p>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 self-end md:self-auto disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving Configurations...' : 'Save Adjustments'}
          </button>
        </div>
      </form>
    </div>
  );
}