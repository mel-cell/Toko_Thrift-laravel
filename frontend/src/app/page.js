"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, logout, getCurrentUser, isAuthenticated } from "../lib/auth";
import DashboardPage from '../app/(user)/dashboard/page'
import DashboardLayout from '../app/(user)/dashboard/layout'

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  );
}
