<?php

namespace App\Http\Controllers;

use App\Models\Pembelian;
use App\Models\PembelianDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class PembelianController extends Controller
{
    // POST /api/pembelian
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pembelian_metode_pembayaran_id' => 'required|uuid|exists:metode_pembayarans,metode_pembayaran_id',
            'pembelian_details' => 'required|array|min:1',
            'pembelian_details.*.pembelian_detail_pakaian_id' => 'required|uuid|exists:pakaians,pakaian_id',
            'pembelian_details.*.pembelian_detail_jumlah' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $user = User::find(Auth::id());
        
        // Validate all pakaian exist and calculate total
        $totalHarga = 0;
        $pakaians = [];
        foreach ($request->pembelian_details as $detail) {
            $pakaian = \App\Models\Pakaian::find($detail['pembelian_detail_pakaian_id']);
            if (!$pakaian) {
                return response()->json(['message' => 'Pakaian not found: ' . $detail['pembelian_detail_pakaian_id']], 404);
            }
            $pakaians[] = $pakaian;
            $totalHarga += $pakaian->pakaian_harga * $detail['pembelian_detail_jumlah'];
        }

        // Check stock availability for all items
        foreach ($request->pembelian_details as $index => $detail) {
            if ($pakaians[$index]->pakaian_stok < $detail['pembelian_detail_jumlah']) {
                return response()->json(['message' => 'Insufficient stock for pakaian: ' . $pakaians[$index]->pakaian_nama], 400);
            }
        }

        // Use database transaction for atomicity
        DB::transaction(function () use ($request, $user, $totalHarga, $pakaians) {
            $pembelian = Pembelian::create([
                'pembelian_id' => Str::uuid(),
                'pembelian_user_id' => $user->user_id,
                'pembelian_metode_pembayaran_id' => $request->pembelian_metode_pembayaran_id,
                'pembelian_tanggal' => now(),
                'pembelian_total_harga' => $totalHarga,
                'pembelian_status' => 'pending',
            ]);

            foreach ($request->pembelian_details as $index => $detail) {
                PembelianDetail::create([
                    'pembelian_detail_id' => Str::uuid(),
                    'pembelian_detail_pembelian_id' => $pembelian->pembelian_id,
                    'pembelian_detail_pakaian_id' => $detail['pembelian_detail_pakaian_id'],
                    'pembelian_detail_jumlah' => $detail['pembelian_detail_jumlah'],
                    'pembelian_detail_total_harga' => $pakaians[$index]->pakaian_harga * $detail['pembelian_detail_jumlah'],
                ]);

                // Reduce stock
                $pakaians[$index]->update([
                    'pakaian_stok' => (int)$pakaians[$index]->pakaian_stok - $detail['pembelian_detail_jumlah']
                ]);
            }
        });

        return response()->json(['message' => 'Pembelian created successfully'], 201);
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
}
