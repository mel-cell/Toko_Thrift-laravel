<?php

namespace App\Http\Controllers;

use App\Models\Pakaian;
use App\Models\KategoriPakaian;
use App\Models\MetodePembayaran;
use App\Http\Resources\PakaianResource;
use Illuminate\Http\Request;

class PakaianController extends Controller
{
    // GET /api/pakaian
    public function index(Request $request)
    {
        $query = Pakaian::with('kategoriPakaian');

        // Search filter
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('pakaian_nama', 'like', "%{$search}%")
                  ->orWhere('pakaian_deskrsipsi', 'like', "%{$search}%")
                  ->orWhereHas('kategoriPakaian', function ($subQ) use ($search) {
                      $subQ->where('kategori_pakaian_nama', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by kategori
        if ($request->has('kategori')) {
            $kategori = $request->input('kategori');
            $query->whereHas('kategoriPakaian', function ($q) use ($kategori) {
                $q->where('kategori_pakaian_nama', $kategori);
            });
        }

        // Pagination
        $perPage = $request->input('per_page', 10);
        $pakaians = $query->paginate($perPage);

        return PakaianResource::collection($pakaians);
    }

    // GET /api/pakaian/{id}
    public function show($id)
    {
        $pakaian = Pakaian::with('kategoriPakaian')->find($id);
        if (!$pakaian) {
            return response()->json(['message' => 'Pakaian not found'], 404);
        }
        return new PakaianResource($pakaian);
    }

    // GET /api/kategori-pakaian
    public function kategoriPakaian()
    {
        $kategori = KategoriPakaian::all();
        return response()->json($kategori);
    }

    // GET /api/metode-pembayaran
    public function metodePembayaran()
    {
        $metode = MetodePembayaran::all();
        return response()->json($metode);
    }

    // GET /api/pakaian/search
    public function search(Request $request)
    {
        $query = Pakaian::with('kategoriPakaian');

        if ($request->has('nama')) {
            $query->where('pakaian_nama', 'like', '%' . $request->input('nama') . '%');
        }

        if ($request->has('kategori_id')) {
            $query->where('pakaian_kategori_pakaian_id', $request->input('kategori_id'));
        }

        if ($request->has('size')) {
            $query->where('pakaian_size', $request->input('size'));
        }

        if ($request->has('min_harga')) {
            $query->where('pakaian_harga', '>=', $request->input('min_harga'));
        }

        if ($request->has('max_harga')) {
            $query->where('pakaian_harga', '<=', $request->input('max_harga'));
        }

        $pakaians = $query->get();
        return PakaianResource::collection($pakaians);
    }
}
