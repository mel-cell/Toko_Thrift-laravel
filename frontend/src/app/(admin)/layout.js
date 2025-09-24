import { Sidebar, SidebarProvider, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarInset } from "@/components/ui/sidebar";
import { Home, ShoppingCart, Users } from 'lucide-react';

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-lg font-semibold">Admin</h2>
          </SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin" isActive>
                <Home className="w-4 h-4" />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/products">
                <ShoppingCart className="w-4 h-4" />
                Products
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/users">
                <Users className="w-4 h-4" />
                Users
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
        <SidebarInset>
          <div className="p-4">
            <SidebarTrigger />
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
