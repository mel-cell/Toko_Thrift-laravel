'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPakaian, updatePakaian } from '@/lib/api';

export default function ProductForm({ open, onOpenChange, product, onSave }) {
  const [formData, setFormData] = useState({ ...product });

  useEffect(() => {
    setFormData({ ...product });
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.id) {
      await updatePakaian(formData.id, formData);
    } else {
      await createPakaian(formData);
    }
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formData.id ? 'Edit Product' : 'Create Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="pakaian_nama">Name</Label>
            <Input id="pakaian_nama" name="pakaian_nama" value={formData.pakaian_nama || ''} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="pakaian_harga">Price</Label>
            <Input id="pakaian_harga" name="pakaian_harga" type="number" value={formData.pakaian_harga || ''} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="pakaian_stok">Stock</Label>
            <Input id="pakaian_stok" name="pakaian_stok" type="number" value={formData.pakaian_stok || ''} onChange={handleChange} />
          </div>
          {/* Add category select here in the future */}
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
