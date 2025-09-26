'use client';

import { useState, useEffect } from 'react';
import { getKategoriPakaian, deleteKategoriPakaian, createKategoriPakaian, updateKategoriPakaian } from '@/lib/api';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { toast } = useToast();

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteKategoriPakaian(selectedCategory.id);
      toast({
        title: "Success",
        description: "Category deleted successfully.",
      });
      setIsDeleteAlertOpen(false);
      fetchCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (formData) => {
    try {
      if (formData.id) {
        await updateKategoriPakaian(formData.id, formData);
        toast({
          title: "Success",
          description: "Category updated successfully.",
        });
      } else {
        await createKategoriPakaian(formData);
        toast({
          title: "Success",
          description: "Category created successfully.",
        });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save category.",
        variant: "destructive",
      });
    }
  };

  const handleCreate = () => {
    setSelectedCategory({});
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={handleCreate}>Create Category</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map(category => (
            <TableRow key={category.id}>
              <TableCell>{category.kategori_pakaian_nama}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(category)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(category)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CategoryForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        category={selectedCategory}
        onSave={handleSave}
      />

      {/* Delete Confirmation Alert */}
      <Dialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the category.
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

function CategoryForm({ open, onOpenChange, category, onSave }) {
  const [formData, setFormData] = useState({ ...category });

  useEffect(() => {
    setFormData({ ...category });
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formData.id ? 'Edit Category' : 'Create Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="kategori_pakaian_nama">Name</Label>
            <Input id="kategori_pakaian_nama" name="kategori_pakaian_nama" value={formData.kategori_pakaian_nama || ''} onChange={handleChange} />
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
