'use client';

import { Sidebar, SidebarProvider, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarHeader, SidebarInset } from "@/components/ui/sidebar";
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings } from 'lucide-react';
import { logout } from "@/lib/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

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
    { name: 'purchases', href: '/admin/purchases', icon: ShoppingBag },
    { name: 'users', href: '/admin/users', icon: Users },
    { name: 'categories', href: '/admin/categories', icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-lg font-semibold">Odama Studio</h2>
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
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
                    {item.name}
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </Sidebar>
        <SidebarInset>
          <div className="p-8 w-full">
            <SidebarTrigger />
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">{pageTitle}</h1>
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}