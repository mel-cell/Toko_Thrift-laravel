"use client";

import React, { useState, useEffect } from "react";
import { getMetodePembayaran, updateAkun } from "../../../lib/api";
import { isAuthenticated } from "../../../lib/auth";
import { useRouter } from "next/navigation";

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    metode_pembayaran_jenis: '',
    metode_pembayaran_nomor: ''
  });
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const methods = await getMetodePembayaran();
      setPaymentMethods(Array.isArray(methods) ? methods : []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setPaymentMethods([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.metode_pembayaran_jenis || !form.metode_pembayaran_nomor) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // For now, we'll just show a message since we don't have a create payment method endpoint
      alert('Payment method added successfully! (This is a demo - actual implementation would save to backend)');
      setShowForm(false);
      setForm({ metode_pembayaran_jenis: '', metode_pembayaran_nomor: '' });
      // In a real implementation, you would call an API to create the payment method
      // fetchPaymentMethods(); // Refresh the list
    } catch (error) {
      console.error('Error adding payment method:', error);
      alert('Failed to add payment method');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      try {
        // In a real implementation, you would call an API to delete the payment method
        alert('Payment method deleted successfully! (This is a demo)');
        // fetchPaymentMethods(); // Refresh the list
      } catch (error) {
        console.error('Error deleting payment method:', error);
        alert('Failed to delete payment method');
      }
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading payment methods...</div>;

  return (
    <div className="container mx-auto p-4 mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Payment Methods</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add Payment Method'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Payment Method</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type
                </label>
                <select
                  value={form.metode_pembayaran_jenis}
                  onChange={(e) => setForm({...form, metode_pembayaran_jenis: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select payment type</option>
                  <option value="DANA">DANA</option>
                  <option value="OVO">OVO</option>
                  <option value="BCA">BCA</option>
                  <option value="COD">Cash on Delivery (COD)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number / Phone Number *
                </label>
                <input
                  type="text"
                  value={form.metode_pembayaran_nomor}
                  onChange={(e) => setForm({...form, metode_pembayaran_nomor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your account number or phone number (required for digital payments)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This number will be displayed to customers when they select your payment method
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Payment Method
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Your Payment Methods</h2>

          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No payment methods added yet.</p>
              <p className="text-sm mt-2">Add a payment method to make purchases easier.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.metode_pembayaran_id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{method.metode_pembayaran_jenis}</h3>
                      {method.metode_pembayaran_nomor && (
                        <p className="text-gray-600">{method.metode_pembayaran_nomor}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(method.metode_pembayaran_id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
