<?php

namespace App\Http\Controllers;

use App\Models\Pembelian;
use App\Models\PembelianDetail;
use App\Models\MetodePembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class PembelianController extends Controller
{
    // POST /api/pembelian
    public function store(Request $request)
    {
        Log::info('Pembelian store request data:', $request->all());
        Log::info('Auth check: ' . Auth::check());

        $validator = Validator::make($request->all(), [
            'alamat' => 'required|string|max:255',
            'metode_pembayaran_id' => 'required|uuid|exists:metode_pembayarans,metode_pembayaran_id',
            'catatan' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.pakaian_id' => 'required|uuid|exists:pakaians,pakaian_id',
            'items.*.jumlah' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            Log::info('Pembelian validation failed:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        Log::info('User ID: ' . $user->user_id);

        try {
            // Validate all pakaian exist and calculate total
            $totalHarga = 0;
            $pakaians = [];
            foreach ($request->items as $item) {
                $pakaian = \App\Models\Pakaian::find($item['pakaian_id']);
                if (!$pakaian) {
                    return response()->json(['message' => 'Pakaian not found: ' . $item['pakaian_id']], 404);
                }
                $pakaians[] = $pakaian;
                $totalHarga += $pakaian->pakaian_harga * $item['jumlah'];
            }

            // Check stock availability for all items
            foreach ($request->items as $index => $item) {
                if ($pakaians[$index]->pakaian_stok < $item['jumlah']) {
                    return response()->json(['message' => 'Insufficient stock for pakaian: ' . $pakaians[$index]->pakaian_nama], 400);
                }
            }

            // Use database transaction for atomicity
            $pembelianId = null;
            DB::transaction(function () use ($request, $user, $totalHarga, $pakaians, &$pembelianId) {
                $pembelian = Pembelian::create([
                    'pembelian_id' => Str::uuid(),
                    'pembelian_user_id' => $user->user_id,
                    'pembelian_metode_pembayaran_id' => $request->metode_pembayaran_id,
                    'pembelian_tanggal' => now(),
                    'pembelian_total_harga' => $totalHarga,
                    'pembelian_status' => 'pending',
                    'pembelian_alamat' => $request->alamat,
                    'pembelian_catatan' => $request->catatan,
                ]);
                $pembelianId = $pembelian->pembelian_id;

                foreach ($request->items as $index => $item) {
                    PembelianDetail::create([
                        'pembelian_detail_id' => Str::uuid(),
                        'pembelian_detail_pembelian_id' => $pembelian->pembelian_id,
                        'pembelian_detail_pakaian_id' => $item['pakaian_id'],
                        'pembelian_detail_jumlah' => $item['jumlah'],
                        'pembelian_detail_total_harga' => $pakaians[$index]->pakaian_harga * $item['jumlah'],
                    ]);

                    // Reduce stock
                    $pakaians[$index]->update([
                        'pakaian_stok' => (int)$pakaians[$index]->pakaian_stok - $item['jumlah']
                    ]);
                }
            });

            Log::info('Purchase created', [
                'user_id' => $user->user_id,
                'total_harga' => $totalHarga,
                'pembelian_id' => $pembelianId
            ]);

            return response()->json(['message' => 'Pembelian created successfully'], 201);
        } catch (\Exception $e) {
            Log::error('Pembelian store exception: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    // GET /api/pembelian
    public function index()
    {
        $user = Auth::user();
        $pembelians = Pembelian::with('pembelianDetails.pakaian')
            ->where('pembelian_user_id', $user->user_id)
            ->get();

        return response()->json($pembelians);
    }

    // GET /api/pembelian/{id}
    public function show($id)
    {
        $user = Auth::user();
        $pembelian = Pembelian::with('pembelianDetails.pakaian')
            ->where('pembelian_user_id', $user->user_id)
            ->where('pembelian_id', $id)
            ->first();

        if (!$pembelian) {
            return response()->json(['message' => 'Pembelian not found'], 404);
        }

        return response()->json($pembelian);
    }

    // PUT /api/akun
    public function updateAkun(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'user_fullname' => 'sometimes|required|string|max:100',
            'user_email' => 'sometimes|required|string|email|max:50|unique:users,user_email,' . $user->user_id . ',user_id',
            'user_nohp' => 'sometimes|required|string|max:13',
            'user_alamat' => 'sometimes|required|string|max:200',
            'user_profil_url' => 'sometimes|required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->user_fullname = $request->input('user_fullname', $user->user_fullname);
        $user->user_email = $request->input('user_email', $user->user_email);
        $user->user_nohp = $request->input('user_nohp', $user->user_nohp);
        $user->user_alamat = $request->input('user_alamat', $user->user_alamat);
        $user->user_profil_url = $request->input('user_profil_url', $user->user_profil_url);

        $user->save();

        return response()->json(['message' => 'User profile updated successfully', 'user' => $user]);
    }

    // PUT /api/pembelian/{id}/cancel
    public function cancel($id)
    {
        $user = Auth::user();
        $pembelian = Pembelian::where('pembelian_user_id', $user->user_id)
            ->where('pembelian_id', $id)
            ->first();

        if (!$pembelian) {
            return response()->json(['message' => 'Pembelian not found'], 404);
        }

        if ($pembelian->pembelian_status !== 'pending') {
            return response()->json(['message' => 'Pembelian cannot be cancelled'], 400);
        }

        // Use transaction to restore stock
        DB::transaction(function () use ($pembelian) {
            foreach ($pembelian->pembelianDetails as $detail) {
                $pakaian = $detail->pakaian;
                $pakaian->update([
                    'pakaian_stok' => (int)$pakaian->pakaian_stok + $detail->pembelian_detail_jumlah
                ]);
            }

            $pembelian->update(['pembelian_status' => 'cancelled']);
        });

        return response()->json(['message' => 'Pembelian cancelled successfully']);
    }

    // PUT /api/admin/pembelian/{id}/status (Admin only)
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

    // GET /api/metode-pembayaran (Protected)
    public function getMetodePembayaran()
    {
        $user = Auth::user();
        $metodePembayaran = MetodePembayaran::where('metode_pembayaran_user_id', $user->user_id)
            ->select('metode_pembayaran_id', 'metode_pembayaran_jenis', 'metode_pembayaran_nomor')
            ->get();
        return response()->json($metodePembayaran);
    }

    // POST /api/metode-pembayaran (Protected)
    public function storeMetodePembayaran(Request $request)
    {
        Log::info('Received data for payment method: ', $request->all());

        $validator = Validator::make($request->all(), [
            'metode_pembayaran_jenis' => 'required|string|in:DANA,OVO,BCA,COD',
            'metode_pembayaran_nomor' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            Log::info('Validation failed: ', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();

        $metodePembayaran = new MetodePembayaran();
        $metodePembayaran->metode_pembayaran_id = Str::uuid();
        $metodePembayaran->metode_pembayaran_user_id = $user->user_id;
        $metodePembayaran->metode_pembayaran_jenis = $request->metode_pembayaran_jenis;
        $metodePembayaran->metode_pembayaran_nomor = $request->metode_pembayaran_nomor;
        $metodePembayaran->save();

        return response()->json([
            'message' => 'Payment method created successfully',
            'metode_pembayaran' => $metodePembayaran
        ], 201);
    }

    // GET /api/admin/pembelian (Admin only)
    public function adminIndex()
    {
        $pembelians = Pembelian::with('user', 'pembelianDetails.pakaian', 'metodePembayaran')->get();
        return response()->json($pembelians);
    }
}
