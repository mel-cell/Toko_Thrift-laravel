<?php

namespace App\Http\Controllers;

use App\Models\Pembelian;
use Illuminate\Http\Request;

class AdminPembelianController extends Controller
{
    // GET /api/admin/pembelian
    public function indexPembelian(Request $request)
    {
        $query = Pembelian::with('user', 'metodePembayaran', 'pembelianDetails.pakaian');

        // Search by user name or product name
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('user_fullname', 'like', "%{$search}%");
                })->orWhereHas('pembelianDetails.pakaian', function ($pakaianQuery) use ($search) {
                    $pakaianQuery->where('pakaian_nama', 'like', "%{$search}%");
                });
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('pembelian_status', $request->input('status'));
        }

        // Pagination
        $perPage = $request->input('per_page', 10);
        $pembelians = $query->paginate($perPage);

        return response()->json($pembelians);
    }

    // GET /api/admin/pembelian/{id}
    public function showPembelian($id)
    {
        $pembelian = Pembelian::with('user', 'metodePembayaran', 'pembelianDetails.pakaian')->find($id);
        if (!$pembelian) {
            return response()->json(['message' => 'Pembelian not found'], 404);
        }
        return response()->json($pembelian);
    }

    // PUT /api/admin/pembelian/{id}/status
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $pembelian = Pembelian::find($id);
        if (!$pembelian) {
            return response()->json(['message' => 'Pembelian not found'], 404);
        }

        $pembelian->update(['pembelian_status' => $request->status]);

        return response()->json(['message' => 'Status updated successfully', 'pembelian' => $pembelian]);
    }

    // GET /api/admin/stats
    public function stats()
    {
        $totalOrders = Pembelian::count();
        $pendingOrders = Pembelian::where('pembelian_status', 'pending')->count();
        $completedOrders = Pembelian::where('pembelian_status', 'completed')->count();
        $totalRevenue = Pembelian::where('pembelian_status', 'completed')->sum('pembelian_total_harga');
        $totalUsers = \App\Models\User::count();
        $totalProducts = \App\Models\Pakaian::count();

        return response()->json([
            'total_orders' => $totalOrders,
            'pending_orders' => $pendingOrders,
            'completed_orders' => $completedOrders,
            'total_revenue' => $totalRevenue,
            'total_users' => $totalUsers,
            'total_products' => $totalProducts,
        ]);
    }
}
