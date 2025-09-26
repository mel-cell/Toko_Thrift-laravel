"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../../lib/auth";
import { getPembelian, getPembelianById } from "../../../lib/api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchOrders();
  }, [router, search, paymentFilter]);

  const fetchOrders = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (paymentFilter) params.payment_method = paymentFilter;
      const data = await getPembelian(params);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = async (id) => {
    setLoadingDetails(true);
    try {
      const data = await getPembelianById(id);
      setSelectedOrder(data);
    } catch (error) {
      console.error("Failed to fetch order details", error);
      alert("Failed to load order details. Please try again.");
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loading) return <div>Loading order history...</div>;

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="min-w-48">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Payment Methods</option>
            <option value="DANA">DANA</option>
            <option value="OVO">OVO</option>
            <option value="BCA">BCA</option>
            <option value="COD">COD</option>
          </select>
        </div>
      </div>

      {selectedOrder && (
        <div className="bg-white p-6 rounded shadow mb-6">
          {loadingDetails ? (
            <div className="text-center py-4">Loading details...</div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Order Details - {selectedOrder.pembelian_id}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p><strong>Total:</strong> Rp {(selectedOrder.pembelian_total_harga ? parseFloat(selectedOrder.pembelian_total_harga) : 0).toLocaleString()}</p>
                  <p><strong>Status:</strong> {selectedOrder.pembelian_status || 'Pending'}</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.pembelian_tanggal).toLocaleDateString()}</p>
                </div>
                <div>
                  <p><strong>Payment Method:</strong> {selectedOrder.metodePembayaran?.metode_pembayaran_jenis || 'N/A'}</p>
                  {selectedOrder.metodePembayaran?.metode_pembayaran_nomor && (
                    <p><strong>Account Number:</strong> {selectedOrder.metodePembayaran.metode_pembayaran_nomor}</p>
                  )}
                  <p><strong>Address:</strong> {selectedOrder.pembelian_alamat}</p>
                  {selectedOrder.pembelian_catatan && (
                    <p><strong>Notes:</strong> {selectedOrder.pembelian_catatan}</p>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">Items:</h3>
              <ul className="space-y-2">
                {selectedOrder.pembelianDetails?.map(detail => (
                  <li key={detail.pembelian_detail_id} className="border p-3 rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{detail.pakaian?.pakaian_nama}</p>
                        <p className="text-sm text-gray-600">Size: {detail.pakaian?.pakaian_size} | Quantity: {detail.pembelian_detail_jumlah}</p>
                      </div>
                      <p className="font-semibold">Rp {(detail.pembelian_detail_total_harga ? parseFloat(detail.pembelian_detail_total_harga) : 0).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <button onClick={() => setSelectedOrder(null)} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                Close
              </button>
            </>
          )}
        </div>
      )}

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
        {orders.length === 0 ? (
          <p>You haven't placed any orders yet.</p>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4">
              {orders.map(order => (
                <div key={order.pembelian_id} className="border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm">Order ID: {order.pembelian_id}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      order.pembelian_status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.pembelian_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.pembelian_status || 'Pending'}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <p><strong>Total:</strong> Rp {(order.pembelian_total_harga ? parseFloat(order.pembelian_total_harga) : 0).toLocaleString()}</p>
                    <p><strong>Payment:</strong> {order.metodePembayaran?.metode_pembayaran_jenis || 'N/A'}</p>
                    <p><strong>Date:</strong> {new Date(order.pembelian_tanggal).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => viewOrderDetails(order.pembelian_id)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Order ID</th>
                    <th className="text-left p-2">Total</th>
                    <th className="text-left p-2">Payment Method</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.pembelian_id} className="border-b">
                      <td className="p-2">{order.pembelian_id}</td>
                      <td className="p-2">Rp {(order.pembelian_total_harga ? parseFloat(order.pembelian_total_harga) : 0).toLocaleString()}</td>
                      <td className="p-2">{order.metodePembayaran?.metode_pembayaran_jenis || 'N/A'}</td>
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
