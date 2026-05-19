"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-5 border-b">
      <h1 className="text-2xl font-bold">
        SocialSync AI 🚀
      </h1>

      <div className="flex gap-5">
        <Link href="/login">
          Login
        </Link>

        <Link href="/register">
          Register
        </Link>
      </div>
    </nav>
  );
}