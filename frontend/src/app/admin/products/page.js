'use client';

import { useState, useEffect } from 'react';
import { getAdminPakaian, deletePakaian, getKategoriPakaian } from '@/lib/api';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";
import { EditProductModal } from "@/components/admin/EditProductModal";
import { AddProductModal } from "@/components/admin/AddProductModal";
import { useToast } from "@/components/ui/use-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [productToEditId, setProductToEditId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (categoryFilter && categoryFilter !== "all") params.category = categoryFilter;
      const data = await getAdminPakaian(params);
      console.log("Fetched products:", data); // Debugging line
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err);
      toast({
        title: "Error",
        description: err.message || "Failed to fetch products.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getKategoriPakaian();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [search, categoryFilter]);

  const handleDeleteClick = (productId) => {
    setProductToDeleteId(productId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDeleteId) {
      setIsDeleting(true);
      try {
        await deletePakaian(productToDeleteId);
        toast({
          title: "Success",
          description: "Product deleted successfully.",
        });
        fetchProducts(); // Refresh the list
        setShowDeleteModal(false);
        setProductToDeleteId(null);
      } catch (err) {
        console.error("Failed to delete product:", err);
        setError(err);
        toast({
          title: "Error",
          description: err.message || "Failed to delete product.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditClick = (productId) => {
    setProductToEditId(productId);
    setShowEditModal(true);
  };

  const handleSaveCallback = () => {
    fetchProducts(); // Refresh the list after edit or add
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return null; // Error is now handled by toast
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setShowAddModal(true)}>Add New Product</Button>
      </div>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.kategori_pakaian_id} value={category.kategori_pakaian_id}>
                {category.kategori_pakaian_nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
          {products.map(product => (
            <TableRow key={product.pakaian_id}>
              <TableCell>{product.pakaian_nama}</TableCell>
              <TableCell>{product.kategori_pakaian?.kategori_pakaian_nama || 'N/A'}</TableCell>
              <TableCell>Rp {parseInt(product.pakaian_harga).toLocaleString()}</TableCell>
              <TableCell>{product.pakaian_stok}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditClick(product.pakaian_id)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(product.pakaian_id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        itemType="product"
        itemName={products.find(p => p.pakaian_id === productToDeleteId)?.pakaian_nama || "this product"}
        isDeleting={isDeleting}
      />

      {showEditModal && (
        <EditProductModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          productId={productToEditId}
          onSave={handleSaveCallback}
        />
      )}

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveCallback}
      />
    </div>
  );
}
