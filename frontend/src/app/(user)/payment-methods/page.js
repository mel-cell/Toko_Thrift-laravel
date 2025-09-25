"use client";

import React, { useState, useEffect } from "react";
import { getMetodePembayaran } from "../../../lib/api";
import { isAuthenticated } from "../../../lib/auth";
import { useRouter } from "next/navigation";
import PaymentMethodModal from "../../../components/PaymentMethodModal";

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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

  const handlePaymentMethodAdded = () => {
    fetchPaymentMethods();
    setShowModal(false);
  };



  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payment Methods</h1>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Add Payment Method
          </button>
        </div>
 
        {/* Add Payment Method Modal */}
        {showModal && (
          <PaymentMethodModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onPaymentMethodAdded={handlePaymentMethodAdded}
          />
        )}

        {/* Payment Methods List */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Your Payment Methods</h2>

          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p className="text-base sm:text-lg">No payment methods added yet.</p>
              <p className="text-sm mt-2">Add a payment method to make purchases easier.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {paymentMethods.map((method) => (
                <div key={method.metode_pembayaran_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900">{method.metode_pembayaran_jenis}</h3>
                      {method.metode_pembayaran_nomor && (
                        <p className="text-gray-600 text-sm sm:text-base mt-1">{method.metode_pembayaran_nomor}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(method.metode_pembayaran_id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
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
