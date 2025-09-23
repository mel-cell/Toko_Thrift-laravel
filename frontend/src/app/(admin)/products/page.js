"use client";

import React, { useState, useEffect } from "react";
import { getAdminPakaian, createPakaian, updatePakaian, deletePakaian, getKategoriPakaian } from "../../../src/lib/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
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
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deletePakaian(id);
        fetchData();
      } catch (error) {
        console.error("Failed to delete product", error);
      }
    }
  };

  const resetForm = () => {
    setEditing(null);
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

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Product' : 'Add New Product'}</h2>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={form.pakaian_kategori_pakaian_id}
            onChange={(e) => setForm({...form, pakaian_kategori_pakaian_id: e.target.value})}
            className="border px-3 py-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.kategori_pakaian_id} value={cat.kategori_pakaian_id}>
                {cat.kategori_pakaian_nama}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Name"
            value={form.pakaian_nama}
            onChange={(e) => setForm({...form, pakaian_nama: e.target.value})}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={form.pakaian_deskrsipsi}
            onChange={(e) => setForm({...form, pakaian_deskrsipsi: e.target.value})}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Size"
            value={form.pakaian_size}
            onChange={(e) => setForm({...form, pakaian_size: e.target.value})}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.pakaian_harga}
            onChange={(e) => setForm({...form, pakaian_harga: e.target.value})}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.pakaian_stok}
            onChange={(e) => setForm({...form, pakaian_stok: e.target.value})}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="url"
            placeholder="Image URL"
            value={form.pakaian_gambar_url}
            onChange={(e) => setForm({...form, pakaian_gambar_url: e.target.value})}
            className="border px-3 py-2 rounded col-span-2"
            required
          />
        </div>
        <div className="flex space-x-2 mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editing ? 'Update' : 'Create'}
          </button>
          {editing && (
            <button type="button" onClick={resetForm} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Product List</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Price</th>
              <th className="text-left p-2">Stock</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.pakaian_id} className="border-b">
                <td className="p-2">{product.pakaian_nama}</td>
                <td className="p-2">Rp {parseInt(product.pakaian_harga).toLocaleString()}</td>
                <td className="p-2">{product.pakaian_stok}</td>
                <td className="p-2">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button onClick={() => handleDelete(product.pakaian_id)} className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
