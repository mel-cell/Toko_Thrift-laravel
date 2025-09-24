"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Search, Eye } from "lucide-react";
import { getAdminPembelian, updatePembelianStatus } from "../../../lib/api";

export default function AdminPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const data = await getAdminPembelian();
      setPurchases(data);
    } catch (error) {
      console.error("Failed to fetch purchases", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updatePembelianStatus(id, { pembelian_status: newStatus });
      fetchPurchases();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setIsDialogOpen(true);
  };

  const filteredPurchases = purchases.filter(purchase =>
    purchase.pembelian_id.toString().includes(searchTerm) ||
    purchase.user?.user_fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.pembelian_status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading purchases...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Manage Purchases</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search purchases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.map(purchase => (
                <TableRow key={purchase.pembelian_id}>
                  <TableCell className="font-medium">#{purchase.pembelian_id}</TableCell>
                  <TableCell>{purchase.user?.user_fullname || 'N/A'}</TableCell>
                  <TableCell>Rp {parseInt(purchase.pembelian_total_harga).toLocaleString()}</TableCell>
                  <TableCell>
                    <Select
                      value={purchase.pembelian_status || 'pending'}
                      onValueChange={(value) => handleStatusUpdate(purchase.pembelian_id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(purchase.pembelian_tanggal).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(purchase)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredPurchases.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No purchases found.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Purchase Details #{selectedPurchase?.pembelian_id}</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-sm text-gray-600">{selectedPurchase.user?.user_fullname || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-600">{selectedPurchase.user?.user_email || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Amount</Label>
                  <p className="text-sm text-gray-600">Rp {parseInt(selectedPurchase.pembelian_total_harga).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm text-gray-600 capitalize">{selectedPurchase.pembelian_status || 'Pending'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm text-gray-600">{new Date(selectedPurchase.pembelian_tanggal).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <p className="text-sm text-gray-600">{selectedPurchase.metode_pembayaran?.metode_pembayaran_nama || 'N/A'}</p>
                </div>
              </div>
              {selectedPurchase.pembelian_alamat && (
                <div>
                  <Label className="text-sm font-medium">Shipping Address</Label>
                  <p className="text-sm text-gray-600">{selectedPurchase.pembelian_alamat}</p>
                </div>
              )}
              {selectedPurchase.pembelian_catatan && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-gray-600">{selectedPurchase.pembelian_catatan}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedPurchase.pembelian_items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">{item.pakaian?.pakaian_nama || 'Product'}</span>
                      <span className="text-sm">Qty: {item.pembelian_item_jumlah} × Rp {parseInt(item.pembelian_item_harga).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
