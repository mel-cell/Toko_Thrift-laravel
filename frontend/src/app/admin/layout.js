'use client';

import { Sidebar, SidebarProvider, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarHeader, SidebarInset } from "@/components/ui/sidebar";
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Users, Tags, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { logout } from "@/lib/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getPageTitle = (path) => {
    if (path === '/admin') return 'Dashboard';
    if (path.startsWith('/admin/products')) return 'Products';
    if (path.startsWith('/admin/purchases')) return 'purchases';
    if (path.startsWith('/admin/users')) return 'users';
    if (path.startsWith('/admin/settings')) return 'Settings';
    return 'Admin';
  };

  const pageTitle = getPageTitle(pathname);

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Purchases', href: '/admin/purchases', icon: ShoppingBag },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar className={`transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <SidebarHeader>
            <h2 className="text-lg font-semibold">{!sidebarCollapsed && "Odama Studio"}</h2>
          </SidebarHeader>
          <SidebarMenu>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <SidebarMenuItem key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                      isActive
                        ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <IconComponent className="w-4 h-4" />
                    {!sidebarCollapsed && item.name}
                  </Link>
                </SidebarMenuItem>
              );
            })}
            <SidebarMenuItem>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {!sidebarCollapsed && "Logout"}
              </button>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
        <SidebarInset>
          <div className="w-full">
            <div className="flex items-center justify-between mb-6 px-8 pt-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{pageTitle}</h1>
              </div>
              <SidebarTrigger />
            </div>
            <div className="px-8 pb-8">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}