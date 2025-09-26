'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAdminPakaianById, updatePakaian, getKategoriPakaian } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast";

export function EditProductModal({
  isOpen,
  onClose,
  productId,
  onSave,
}) {
  const [productData, setProductData] = useState({
    pakaian_nama: '',
    pakaian_deskripsi: '',
    pakaian_harga: '',
    pakaian_stok: '',
    kategori_pakaian_id: '',
    pakaian_gambar: '',
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && productId) {
      const fetchProductAndCategories = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const [productRes, categoriesRes] = await Promise.all([
            getAdminPakaianById(productId),
            getKategoriPakaian()
          ]);
          setProductData({
            pakaian_nama: productRes.pakaian_nama || '',
            pakaian_deskripsi: productRes.pakaian_deskripsi || '',
            pakaian_harga: productRes.pakaian_harga || '',
            pakaian_stok: productRes.pakaian_stok || '',
            kategori_pakaian_id: productRes.kategori_pakaian_id || '',
            pakaian_gambar: productRes.pakaian_gambar || '',
          });
          setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
        } catch (err) {
          console.error("Failed to fetch product or categories:", err);
          setError(err);
          toast({
            title: "Error",
            description: err.message || "Failed to fetch product details or categories.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchProductAndCategories();
    }
  }, [isOpen, productId, toast]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCategoryChange = (value) => {
    setProductData(prev => ({
      ...prev,
      kategori_pakaian_id: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await updatePakaian(productId, productData);
      toast({
        title: "Success",
        description: "Product updated successfully.",
      });
      onSave(); // Refresh list in parent component
      onClose();
    } catch (err) {
      console.error("Failed to update product:", err);
      setError(err);
      toast({
        title: "Error",
        description: err.message || "Failed to update product.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to the product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div>Loading product details...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error.message}</div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pakaian_nama" className="text-right">Name</Label>
              <Input id="pakaian_nama" value={productData.pakaian_nama} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pakaian_deskripsi" className="text-right">Description</Label>
              <Input id="pakaian_deskripsi" value={productData.pakaian_deskripsi} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pakaian_harga" className="text-right">Price</Label>
              <Input id="pakaian_harga" type="number" value={productData.pakaian_harga} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pakaian_stok" className="text-right">Stock</Label>
              <Input id="pakaian_stok" type="number" value={productData.pakaian_stok} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="kategori_pakaian_id" className="text-right">Category</Label>
              <Select onValueChange={handleCategoryChange} value={productData.kategori_pakaian_id?.toString()}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.kategori_nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pakaian_gambar" className="text-right">Image URL</Label>
              <Input id="pakaian_gambar" value={productData.pakaian_gambar} onChange={handleChange} className="col-span-3" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
