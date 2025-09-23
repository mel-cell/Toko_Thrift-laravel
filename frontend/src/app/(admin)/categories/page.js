"use client";

import React, { useState, useEffect } from "react";
import { getKategoriPakaian, createKategoriPakaian, updateKategoriPakaian, deleteKategoriPakaian } from "../../../src/lib/api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ kategori_pakaian_nama: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getKategoriPakaian();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateKategoriPakaian(editing.kategori_pakaian_id, form);
      } else {
        await createKategoriPakaian(form);
      }
      fetchCategories();
      resetForm();
    } catch (error) {
      console.error("Failed to save category", error);
    }
  };

  const handleEdit = (category) => {
    setEditing(category);
    setForm({ kategori_pakaian_nama: category.kategori_pakaian_nama });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteKategoriPakaian(id);
        fetchCategories();
      } catch (error) {
        console.error("Failed to delete category", error);
      }
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ kategori_pakaian_nama: '' });
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Category' : 'Add New Category'}</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={form.kategori_pakaian_nama}
          onChange={(e) => setForm({...form, kategori_pakaian_nama: e.target.value})}
          className="w-full border px-3 py-2 rounded"
          required
        />
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
        <h2 className="text-xl font-semibold mb-4">Category List</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.kategori_pakaian_id} className="border-b">
                <td className="p-2">{category.kategori_pakaian_nama}</td>
                <td className="p-2">
                  <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button onClick={() => handleDelete(category.kategori_pakaian_id)} className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
