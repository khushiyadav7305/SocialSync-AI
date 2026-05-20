"use client";

import { useState } from "react";
import API from "../../services/api";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext"; 
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth(); 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", formData);

      if (res.data && res.data.token) {
        toast.success("Registration Successful 🎉");
        
        // State update aur localstorage sync karega instantly
        login(res.data.token, res.data.user || { id: res.data.id, name: res.data.name, email: res.data.email });
        
        router.push("/dashboard");
      } else {
        toast.error("Invalid response from server.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#030712]">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] p-8 border border-gray-800 bg-[#0B0F19] rounded-2xl space-y-5 shadow-xl"
      >
        <div className="space-y-1 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-xs text-gray-500">Sign up to start your SocialSync automation</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              onChange={handleChange}
              className="w-full bg-[#030712] border border-gray-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-200 text-sm transition-colors placeholder-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              onChange={handleChange}
              className="w-full bg-[#030712] border border-gray-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-200 text-sm transition-colors placeholder-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full bg-[#030712] border border-gray-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-200 text-sm transition-colors placeholder-gray-600"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white p-3 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/10 transition-all mt-2"
        >
          Register
        </button>
      </form>
    </div>
  );
}