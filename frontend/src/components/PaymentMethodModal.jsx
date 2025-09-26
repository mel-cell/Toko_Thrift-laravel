'use client';

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { createMetodePembayaran, getMetodePembayaran } from "../lib/api";
import { isAuthenticated } from "../lib/auth";

function PaymentMethodModal({ isOpen, onClose, onPaymentMethodAdded }) {
  const [formData, setFormData] = useState({
    jenis: '',
    nomor: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableTypes] = useState([
    { value: 'DANA', label: 'DANA' },
    { value: 'OVO', label: 'OVO' },
    { value: 'BCA', label: 'BCA' },
    { value: 'COD', label: 'Cash on Delivery (COD)' }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      setError('Please login to save payment method');
      return;
    }

    if (!formData.jenis || !formData.nomor) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const paymentMethodData = {
        user_id: user.id,
        metode_pembayaran_jenis: formData.jenis,
        metode_pembayaran_nomor: formData.nomor
      };

      await createMetodePembayaran(paymentMethodData);

      // Reset form
      setFormData({ jenis: '', nomor: '' });

      // Close modal and notify parent
      onClose();
      if (onPaymentMethodAdded) {
        onPaymentMethodAdded();
      }

    } catch (error) {
      console.error('Error creating payment method:', error);
      setError('Failed to save payment method. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Add Payment Method</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Payment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Type *
              </label>
              <select
                name="jenis"
                value={formData.jenis}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select payment type</option>
                {availableTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number / Phone Number *
              </label>
              <input
                type="text"
                name="nomor"
                value={formData.nomor}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your account number or phone number"
              />
              <p className="text-xs text-gray-500 mt-1">
                For digital wallets, enter your registered phone number
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Payment Method'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaymentMethodModal;
