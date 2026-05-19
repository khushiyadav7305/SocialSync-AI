"use client";

import { useState } from "react";
import API from "../../services/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

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

      localStorage.setItem("token", res.data.token);

      toast.success("Registration Successful");

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] p-8 border rounded-xl space-y-4"
      >
        <h1 className="text-3xl font-bold text-center">
          Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded-lg"
        >
          Register
        </button>
      </form>
    </div>
  );
}