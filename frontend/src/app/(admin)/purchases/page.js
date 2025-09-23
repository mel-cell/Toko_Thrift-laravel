"use client";

import React, { useState, useEffect } from "react";
import { getAdminPembelian, updatePembelianStatus } from "../../../src/lib/api";

export default function AdminPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading purchases...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Purchases</h1>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Purchase List</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">User</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(purchase => (
              <tr key={purchase.pembelian_id} className="border-b">
                <td className="p-2">{purchase.pembelian_id}</td>
                <td className="p-2">{purchase.user?.user_fullname || 'N/A'}</td>
                <td className="p-2">Rp {parseInt(purchase.pembelian_total_harga).toLocaleString()}</td>
                <td className="p-2">
                  <select
                    value={purchase.pembelian_status || 'pending'}
                    onChange={(e) => handleStatusUpdate(purchase.pembelian_id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-2">{new Date(purchase.pembelian_tanggal).toLocaleDateString()}</td>
                <td className="p-2">
                  <button className="text-blue-600 hover:text-blue-800">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
