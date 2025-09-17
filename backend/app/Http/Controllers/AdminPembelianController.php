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
            'status' => 'required|in:pending,completed,cancelled',
        ]);

        $pembelian = Pembelian::find($id);
        if (!$pembelian) {
            return response()->json(['message' => 'Pembelian not found'], 404);
        }

        $pembelian->update(['pembelian_status' => $request->status]);

        return response()->json(['message' => 'Pembelian status updated successfully', 'pembelian' => $pembelian]);
    }
}
