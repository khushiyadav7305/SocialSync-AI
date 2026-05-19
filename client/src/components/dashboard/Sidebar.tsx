"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-[250px] h-screen border-r p-5 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-10">
          SocialSync AI 🚀
        </h1>

        <div className="flex flex-col gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 hover:bg-gray-100 p-3 rounded-lg"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/schedule"
            className="flex items-center gap-3 hover:bg-gray-100 p-3 rounded-lg"
          >
            <CalendarDays size={20} />
            Scheduler
          </Link>

          <Link
            href="/dashboard/analytics"
            className="flex items-center gap-3 hover:bg-gray-100 p-3 rounded-lg"
          >
            <BarChart3 size={20} />
            Analytics
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 hover:bg-gray-100 p-3 rounded-lg"
          >
            <Settings size={20} />
            Settings
          </Link>
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        className="flex items-center gap-3 bg-red-500 text-white p-3 rounded-lg"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}