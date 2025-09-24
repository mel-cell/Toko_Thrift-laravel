"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Plus, Edit, Trash2, Search } from "lucide-react";
import { getAdminPakaian, createPakaian, updatePakaian, deletePakaian, getKategoriPakaian } from "../../../lib/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    pakaian_kategori_pakaian_id: '',
    pakaian_nama: '',
    pakaian_deskrsipsi: '',
    pakaian_size: '',
    pakaian_harga: '',
    pakaian_stok: '',
    pakaian_gambar_url: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pakaianData, kategoriData] = await Promise.all([
        getAdminPakaian(),
        getKategoriPakaian()
      ]);
      setProducts(pakaianData);
      setCategories(kategoriData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updatePakaian(editing.pakaian_id, form);
      } else {
        await createPakaian(form);
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error("Failed to save product", error);
    }
  };

  const handleEdit = (product) => {
    setEditing(product);
    setForm({
      pakaian_kategori_pakaian_id: product.pakaian_kategori_pakaian_id,
      pakaian_nama: product.pakaian_nama,
      pakaian_deskrsipsi: product.pakaian_deskrsipsi,
      pakaian_size: product.pakaian_size,
      pakaian_harga: product.pakaian_harga,
      pakaian_stok: product.pakaian_stok,
      pakaian_gambar_url: product.pakaian_gambar_url
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deletePakaian(id);
      fetchData();
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setIsDialogOpen(false);
    setForm({
      pakaian_kategori_pakaian_id: '',
      pakaian_nama: '',
      pakaian_deskrsipsi: '',
      pakaian_size: '',
      pakaian_harga: '',
      pakaian_stok: '',
      pakaian_gambar_url: ''
    });
  };

  const handleNewProduct = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredProducts = products.filter(product =>
    product.pakaian_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.pakaian_deskrsipsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={form.pakaian_kategori_pakaian_id}
                    onValueChange={(value) => setForm({...form, pakaian_kategori_pakaian_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.kategori_pakaian_id} value={cat.kategori_pakaian_id}>
                          {cat.kategori_pakaian_nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Product Name"
                    value={form.pakaian_nama}
                    onChange={(e) => setForm({...form, pakaian_nama: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Product Description"
                    value={form.pakaian_deskrsipsi}
                    onChange={(e) => setForm({...form, pakaian_deskrsipsi: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    placeholder="Product Size"
                    value={form.pakaian_size}
                    onChange={(e) => setForm({...form, pakaian_size: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Product Price"
                    value={form.pakaian_harga}
                    onChange={(e) => setForm({...form, pakaian_harga: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="Product Stock"
                    value={form.pakaian_stok}
                    onChange={(e) => setForm({...form, pakaian_stok: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    placeholder="Product Image URL"
                    value={form.pakaian_gambar_url}
                    onChange={(e) => setForm({...form, pakaian_gambar_url: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editing ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search products..."
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
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map(product => (
                <TableRow key={product.pakaian_id}>
                  <TableCell className="font-medium">{product.pakaian_nama}</TableCell>
                  <TableCell>{product.kategori_pakaian?.kategori_pakaian_nama || 'No Category'}</TableCell>
                  <TableCell>Rp {parseInt(product.pakaian_harga).toLocaleString()}</TableCell>
                  <TableCell>{product.pakaian_stok}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the product.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(product.pakaian_id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
