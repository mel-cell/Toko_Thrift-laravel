import { Sidebar, SidebarProvider, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarInset } from "@/components/ui/sidebar";
import { Home, ShoppingCart, Users, Package, Settings } from 'lucide-react';
import { logout } from "@/lib/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const getPageTitle = (path) => {
    if (path === '/admin') return 'Dashboard';
    if (path.startsWith('/admin/products')) return 'Products';
    if (path.startsWith('/admin/purchases')) return 'Purchases';
    if (path.startsWith('/admin/users')) return 'Users';
    if (path.startsWith('/admin/categories')) return 'Categories';
    return 'Admin';
  };

  const pageTitle = getPageTitle(pathname);

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Purchases', href: '/admin/purchases', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Categories', href: '/admin/categories', icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-md mt-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
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
          <div className="p-4 md:p-6 lg:p-8 w-full">
            <div className="flex items-center justify-between mb-6">
              <SidebarTrigger />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{pageTitle}</h1>
            </div>
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
