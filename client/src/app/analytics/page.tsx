'use client';
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { BarChart3, TrendingUp, Users, Calendar, Award } from 'lucide-react';

export default function AnalyticsPage() {
  // Mock Production SaaS Analytics Data
  const weeklyData = [
    { name: 'Mon', engagement: 2400, reach: 4000 },
    { name: 'Tue', engagement: 1398, reach: 3000 },
    { name: 'Wed', engagement: 9800, reach: 12000 },
    { name: 'Thu', engagement: 3908, reach: 5500 },
    { name: 'Fri', engagement: 4800, reach: 7000 },
    { name: 'Sat', engagement: 3800, reach: 6000 },
    { name: 'Sun', engagement: 4300, reach: 6800 },
  ];

  const platformData = [
    { name: 'LinkedIn', value: 45 },
    { name: 'Instagram', value: 30 },
    { name: 'Twitter / X', value: 25 },
  ];

  const COLORS = ['#3b82f6', '#ec4899', '#6366f1'];

  const stats = [
    { title: 'Total Reach', value: '44.2K', change: '+12.5%', icon: Users, color: 'text-blue-500' },
    { title: 'Engagement Rate', value: '5.8%', change: '+2.1%', icon: TrendingUp, color: 'text-emerald-500' },
    { title: 'Scheduled Queues', value: '6 Active', change: 'Synced', icon: Calendar, color: 'text-indigo-500' },
    { title: 'Top Performing Post', value: 'MERN Guide', change: 'Viral 🔥', icon: Award, color: 'text-purple-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Cards Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.title}</span>
              <h3 className="text-2xl font-bold text-gray-100">{stat.value}</h3>
              <span className={`text-xs font-semibold ${stat.change.includes('+') || stat.change.includes('Viral') ? 'text-emerald-400' : 'text-indigo-400'}`}>
                {stat.change}
              </span>
            </div>
            <div className={`p-3 bg-gray-900/60 border border-gray-800 rounded-xl ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Engagement Chart */}
        <div className="lg:col-span-2 bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-gray-200">Weekly Engagement Metrics</h3>
          </div>
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#374151', borderRadius: '12px' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Bar dataKey="engagement" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reach" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Distribution Chart */}
        <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-gray-200">Platform Share</h3>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#374151', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Custom Legend Grid */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-gray-800/60">
            {platformData.map((p, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-xs font-medium text-gray-400">{p.name}</span>
                <span className="text-sm font-bold mt-0.5" style={{ color: COLORS[i] }}>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}