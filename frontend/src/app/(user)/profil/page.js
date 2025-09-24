"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getCurrentUser, logout } from "../../../lib/auth";
import { updateAkun } from "../../../lib/api";
import { Button } from "../../../components/ui/button";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        setForm({
          user_fullname: currentUser.user_fullname,
          user_email: currentUser.user_email,
          user_nohp: currentUser.user_nohp,
          user_alamat: currentUser.user_alamat,
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedUser = await updateAkun(form);
      setUser(updatedUser.user);
      setEditing(false);
      localStorage.setItem('user', JSON.stringify(updatedUser.user));
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
          <Button asChild className="mt-4">
            <a href="/login">Login</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 mt-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h1 className="text-xl font-semibold text-gray-900">Profile Settings</h1>
          </div>

          <div className="p-6">
            {!editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border">{user.user_fullname}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border">{user.user_email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border">{user.user_nohp}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border">{user.user_alamat}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="user_fullname"
                      value={form.user_fullname}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="user_email"
                      value={form.user_email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="user_nohp"
                      value={form.user_nohp}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      name="user_alamat"
                      value={form.user_alamat}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={() => setEditing(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
