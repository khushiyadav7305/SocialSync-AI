'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Calendar, Sparkles, Plus, AlertCircle, ArrowRight } from 'lucide-react';
import { Post } from '../../models/types';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPostsSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data)) {
          setPosts(response.data.slice(0, 3)); // Display only top 3 items inside matrix rows
        }
      } catch (err) {
        console.error('Overview Stats Fetch Failures:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPostsSummary();
  }, []);

  const totalScheduledCount = posts.filter(p => p.status === 'scheduled').length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Welcome Greetings Banner */}
      <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-black text-white tracking-wide">Swagat hai, {user?.name || 'Developer'}! 👋</h2>
          <p className="text-sm text-indigo-100 max-w-xl">
            SocialSync AI platform completely active aur functional chal raha hai. Ek hi integrated automated dashboard panel se content create, schedule aur track karein.
          </p>
        </div>
        <Link 
          href="/dashboard/schedule" 
          className="flex items-center gap-2 bg-white text-indigo-600 font-semibold py-3 px-5 rounded-xl shadow-md hover:bg-indigo-50 transition-all text-sm whitespace-nowrap self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create New Schedule
        </Link>
      </div>

      {/* Main Structural Status Matrices Columns split grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side Section: Pipeline Activity overview boxes row blocks */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Queue System Processing Matrix</h3>
            <Link href="/dashboard/schedule" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              Manage Queues <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-8 text-center flex justify-center items-center gap-2">
              <div className="h-4 w-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-xs text-gray-500">Syncing Automation Streams...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <AlertCircle className="h-8 w-8 text-gray-600 mb-3" />
              <h4 className="text-sm font-semibold text-gray-300">No pipelines created yet</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">Content scheduler tab par jakar pehla post pipeline schedule karein.</p>
            </div>
          ) : (
            <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl overflow-hidden shadow-lg divide-y divide-gray-800/60">
              {posts.map((post) => (
                <div key={post._id} className="p-4 flex items-center justify-between gap-4 bg-gray-900/10 hover:bg-gray-900/30 transition-colors">
                  <div className="truncate space-y-1">
                    <p className="text-sm text-gray-300 truncate font-medium">{post.caption}</p>
                    <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                      Target: {new Date(post.scheduledTime).toLocaleString()}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    post.status === 'published' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side Section: Shortcut Cards Callouts grids column wrappers */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Quick Tools Modules</h3>
          
          <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex gap-3">
              <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl h-fit">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-200">AI Copywriter Engine</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Gemini AI module use karke instantly trending captions aur hashtags bundles ready karein.</p>
              </div>
            </div>
            <Link href="/ai" className="block text-center w-full bg-gray-950 border border-gray-800 hover:border-gray-700 text-gray-300 text-xs font-semibold py-2.5 rounded-xl transition-all">
              Launch Copilot Engine
            </Link>
          </div>

          <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex gap-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl h-fit">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-200">Editorial Schedules</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Apne pure month ke scheduling buffers aur calendar metrics ki timelines map check karein.</p>
              </div>
            </div>
            <Link href="/calendar" className="block text-center w-full bg-gray-950 border border-gray-800 hover:border-gray-700 text-gray-300 text-xs font-semibold py-2.5 rounded-xl transition-all">
              Open Editorial Grid
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}