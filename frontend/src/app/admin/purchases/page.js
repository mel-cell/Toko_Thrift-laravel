'use client';

import { useState, useEffect } from 'react';
import { getAdminPembelian, createAdminPembelian, updateAdminPembelian, deleteAdminPembelian } from '@/lib/api';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formData, setFormData] = useState({
    user_id: '',
    pembelian_total_harga: '',
    pembelian_status: '',
    alamat: '',
    metode_pembayaran_id: '',
    catatan: '',
  });
  const { toast } = useToast();

  const fetchPurchases = async () => {
    const params = {};
    if (search) params.search = search;
    if (statusFilter && statusFilter !== "all") params.status = statusFilter;
    const data = await getAdminPembelian(params);
    setPurchases(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchPurchases();
  }, [search, statusFilter]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddClick = () => {
    setCurrentPurchase(null);
    setFormData({
      user_id: '',
      pembelian_total_harga: '',
      pembelian_status: '',
      alamat: '',
      metode_pembayaran_id: '',
      catatan: '',
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (purchase) => {
    setCurrentPurchase(purchase);
    setFormData({
      user_id: purchase.user_id,
      pembelian_total_harga: purchase.pembelian_total_harga,
      pembelian_status: purchase.pembelian_status,
      alamat: purchase.alamat,
      metode_pembayaran_id: purchase.metode_pembayaran_id,
      catatan: purchase.catatan,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (purchase) => {
    setCurrentPurchase(purchase);
    setIsDeleteAlertOpen(true);
  };

  const handleSavePurchase = async () => {
    try {
      if (currentPurchase) {
        await updateAdminPembelian(currentPurchase.pembelian_id, formData);
        toast({
          title: "Success",
          description: "Purchase updated successfully.",
        });
      } else {
        await createAdminPembelian(formData);
        toast({
          title: "Success",
          description: "Purchase created successfully.",
        });
      }
      setIsModalOpen(false);
      fetchPurchases();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save purchase.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAdminPembelian(currentPurchase.pembelian_id);
      toast({
        title: "Success",
        description: "Purchase deleted successfully.",
      });
      setIsDeleteAlertOpen(false);
      fetchPurchases();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete purchase.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Purchases</h1>
        <Button onClick={handleAddClick}>Add New Purchase</Button>
      </div>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search purchases..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map(purchase => (
            <TableRow key={purchase.pembelian_id}>
              <TableCell>{purchase.user?.user_fullname || 'N/A'}</TableCell>
              <TableCell>Rp {parseInt(purchase.pembelian_total_harga).toLocaleString()}</TableCell>
              <TableCell>{purchase.pembelian_status}</TableCell>
              <TableCell>{new Date(purchase.pembelian_tanggal).toLocaleDateString()}</TableCell>
              <TableCell className="flex gap-2">
                <Link href={`/admin/purchases/${purchase.pembelian_id}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => handleEditClick(purchase)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(purchase)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create/Edit Purchase Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentPurchase ? "Edit Purchase" : "Add New Purchase"}</DialogTitle>
            <DialogDescription>
              {currentPurchase ? "Edit the purchase details." : "Fill in the details for a new purchase."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="user_id" className="text-right">
                User ID
              </Label>
              <Input id="user_id" value={formData.user_id} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pembelian_total_harga" className="text-right">
                Total Price
              </Label>
              <Input id="pembelian_total_harga" value={formData.pembelian_total_harga} onChange={handleInputChange} className="col-span-3" type="number" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pembelian_status" className="text-right">
                Status
              </Label>
              <Input id="pembelian_status" value={formData.pembelian_status} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alamat" className="text-right">
                Address
              </Label>
              <Input id="alamat" value={formData.alamat} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="metode_pembayaran_id" className="text-right">
                Payment Method ID
              </Label>
              <Input id="metode_pembayaran_id" value={formData.metode_pembayaran_id} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="catatan" className="text-right">
                Notes
              </Label>
              <Input id="catatan" value={formData.catatan} onChange={handleInputChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSavePurchase}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <Dialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the purchase.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteAlertOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
