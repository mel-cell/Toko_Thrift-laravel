// app/admin/page.js
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingBag, Users, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const latestOrders = [
    { id: "#12345", date: "Jan 24th, 2020", customer: "Roberto Carlo", location: "Corner Street 5th Londo", amount: "$34.20", status: "New Order" },
    { id: "#12366", date: "Jan 22th, 2020", customer: "Rohmad Khair", location: "Lando Street 5th Yogos", amount: "$44.25", status: "On Delivery" },
  ];

  return (
    <div className="space-y-8">
      {/* Bagian Kartu Statistik */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Menus</CardTitle>
            <Menu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            {/* Tambahkan representasi grafik sederhana jika perlu */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders Today</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">180</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Client Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">240</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Day Ratio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">140</div>
          </CardContent>
        </Card>
      </div>

      {/* Bagian Tabel Daftar Pesanan */}
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status Order</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestOrders.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.location}</TableCell>
                  <TableCell className="text-right">{order.amount}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>...</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}