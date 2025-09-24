'use client';

import { useState, useEffect } from 'react';
import { getAdminPembelianById, updatePembelianStatus } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function PurchaseDetailPage({ params }) {
  const [purchase, setPurchase] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchPurchase = async () => {
      const data = await getAdminPembelianById(params.id);
      setPurchase(data);
      setStatus(data.pembelian_status);
    };
    fetchPurchase();
  }, [params.id]);

  const handleStatusUpdate = async () => {
    await updatePembelianStatus(params.id, { status });
    alert('Status updated successfully!');
  };

  if (!purchase) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Purchase Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>Purchase #{purchase.id}</CardTitle>
          <CardDescription>Customer: {purchase.user.user_fullname}</CardDescription>
        </CardHeader>
        <CardContent>
          <p><strong>Total:</strong> {purchase.pembelian_total_harga}</p>
          <p><strong>Date:</strong> {new Date(purchase.created_at).toLocaleDateString()}</p>
          <div className="flex items-center mt-4">
            <p className="mr-4"><strong>Status:</strong></p>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleStatusUpdate} className="ml-4">Update Status</Button>
          </div>
          <h2 className="text-2xl font-bold mt-8 mb-4">Items</h2>
          <ul>
            {purchase.pembelian_details.map(item => (
              <li key={item.id} className="flex justify-between items-center border-b py-2">
                <span>{item.pakaian.pakaian_nama}</span>
                <span>Quantity: {item.pembelian_detail_jumlah}</span>
                <span>Price: {item.pembelian_detail_harga_total}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
