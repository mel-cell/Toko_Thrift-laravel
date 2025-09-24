'use client';

import { useState, useEffect } from 'react';
import { createPakaian, getKategoriPakaian } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddProductModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    pakaian_nama: '',
    pakaian_deskripsi: '',
    pakaian_harga: '',
    pakaian_stok: '',
    kategori_pakaian_id: '',
    pakaian_gambar: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getKategoriPakaian();
        setCategories(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch categories.",
          variant: "destructive",
        });
      }
    };
    fetchCategories();
  }, [toast]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, kategori_pakaian_id: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPakaian(formData);
      toast({
        title: "Success",
        description: "Product created successfully.",
      });
      onSave();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create product.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details for the new product.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pakaian_nama" className="text-right">Name</Label>
            <Input id="pakaian_nama" value={formData.pakaian_nama} onChange={handleInputChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pakaian_deskripsi" className="text-right">Description</Label>
            <Input id="pakaian_deskripsi" value={formData.pakaian_deskripsi} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pakaian_harga" className="text-right">Price</Label>
            <Input id="pakaian_harga" type="number" value={formData.pakaian_harga} onChange={handleInputChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pakaian_stok" className="text-right">Stock</Label>
            <Input id="pakaian_stok" type="number" value={formData.pakaian_stok} onChange={handleInputChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="kategori_pakaian_id" className="text-right">Category</Label>
            <Select onValueChange={handleCategoryChange} value={formData.kategori_pakaian_id}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.kategori_pakaian_nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pakaian_gambar" className="text-right">Image URL</Label>
            <Input id="pakaian_gambar" value={formData.pakaian_gambar} onChange={handleInputChange} className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
