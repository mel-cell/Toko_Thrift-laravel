"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../../lib/auth";
import { getPembelian, getPembelianById } from "../../../lib/api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const data = await getPembelian();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = async (id) => {
    try {
      const data = await getPembelianById(id);
      setSelectedOrder(data);
    } catch (error) {
      console.error("Failed to fetch order details", error);
    }
  };

  if (loading) return <div>Loading order history...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>

      {selectedOrder && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details - {selectedOrder.pembelian_id}</h2>
          <p><strong>Total:</strong> Rp {parseInt(selectedOrder.pembelian_total_harga).toLocaleString()}</p>
          <p><strong>Status:</strong> {selectedOrder.pembelian_status || 'Pending'}</p>
          <p><strong>Date:</strong> {new Date(selectedOrder.pembelian_tanggal).toLocaleDateString()}</p>
          <h3 className="text-lg font-semibold mt-4 mb-2">Items:</h3>
          <ul>
            {selectedOrder.pembelianDetails?.map(detail => (
              <li key={detail.pembelian_detail_id} className="mb-2">
                {detail.pakaian?.pakaian_nama} - Quantity: {detail.pembelian_detail_jumlah} - Price: Rp {parseInt(detail.pembelian_detail_total_harga).toLocaleString()}
              </li>
            ))}
          </ul>
          <button onClick={() => setSelectedOrder(null)} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            Close
          </button>
        </div>
      )}

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
        {orders.length === 0 ? (
          <p>You haven't placed any orders yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Order ID</th>
                <th className="text-left p-2">Total</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.pembelian_id} className="border-b">
                  <td className="p-2">{order.pembelian_id}</td>
                  <td className="p-2">Rp {parseInt(order.pembelian_total_harga).toLocaleString()}</td>
                  <td className="p-2">{order.pembelian_status || 'Pending'}</td>
                  <td className="p-2">{new Date(order.pembelian_tanggal).toLocaleDateString()}</td>
                  <td className="p-2">
                    <button onClick={() => viewOrderDetails(order.pembelian_id)} className="text-blue-600 hover:text-blue-800">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
