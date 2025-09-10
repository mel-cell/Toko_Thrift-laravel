"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, logout, getCurrentUser, isAuthenticated } from "../lib/auth";

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState({ user_username: "", user_password: "" });
  const [error, setError] = useState(null);
  const [user, setUser] = useState(getCurrentUser());

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(form);
      setUser(data.user);
      router.refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {isAuthenticated() && user ? (
        <div>
          <h2>Welcome, {user.user_fullname}!</h2>
          <p>Role: {user.user_level}</p>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
          <input
            type="text"
            name="user_username"
            placeholder="Username"
            value={form.user_username}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            name="user_password"
            placeholder="Password"
            value={form.user_password}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
}
