<?php

namespace App\Http\Controllers;

use App\Models\Pakaian;
use App\Models\KategoriPakaian;
use App\Http\Resources\PakaianResource;
use Illuminate\Http\Request;

class PakaianController extends Controller
{
    // GET /api/pakaian
    public function index()
    {
        $pakaians = Pakaian::with('kategoriPakaian')->get();
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
}
