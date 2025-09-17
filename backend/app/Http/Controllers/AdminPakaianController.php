<?php

namespace App\Http\Controllers;

use App\Models\Pakaian;
use App\Models\KategoriPakaian;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Requests\StorePakaianRequest;
use App\Http\Requests\UpdatePakaianRequest;

class AdminPakaianController extends Controller
{
    // GET /api/admin/pakaian
    public function indexPakaian(Request $request)
    {
        $query = Pakaian::with('kategoriPakaian');

        // Add search filter
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('pakaian_nama', 'like', "%{$search}%")
                  ->orWhere('pakaian_deskrsipsi', 'like', "%{$search}%");
        }

        // Add kategori filter
        if ($request->has('kategori')) {
            $kategori = $request->input('kategori');
            $query->where('pakaian_kategori_pakaian_id', $kategori);
        }

        $pakaians = $query->get();
        return response()->json($pakaians);
    }

    // GET /api/admin/pakaian/{id}
    public function showPakaian($id)
    {
        $pakaian = Pakaian::find($id);
        if (!$pakaian) {
            return response()->json(['message' => 'Pakaian not found'], 404);
        }
        return response()->json($pakaian);
    }

    // POST /api/admin/pakaian
    public function storePakaian(StorePakaianRequest $request)
    {
        $data = $request->validated();
        $data['pakaian_id'] = Str::uuid();

        $pakaian = Pakaian::create($data);

        return response()->json(['message' => 'Pakaian created successfully', 'pakaian' => $pakaian], 201);
    }

    // PUT /api/admin/pakaian/{id}
    public function updatePakaian(UpdatePakaianRequest $request, $id)
    {
        $pakaian = Pakaian::find($id);
        if (!$pakaian) {
            return response()->json(['message' => 'Pakaian not found'], 404);
        }

        $data = $request->validated();
        $pakaian->update($data);

        return response()->json(['message' => 'Pakaian updated successfully', 'pakaian' => $pakaian]);
    }

    // DELETE /api/admin/pakaian/{id}
    public function destroyPakaian($id)
    {
        $pakaian = Pakaian::find($id);
        if (!$pakaian) {
            return response()->json(['message' => 'Pakaian not found'], 404);
        }

        $pakaian->delete();

        return response()->json(['message' => 'Pakaian deleted successfully']);
    }

    // POST /api/admin/kategori-pakaian
    public function storeKategoriPakaian(Request $request)
    {
        $request->validate([
            'kategori_pakaian_nama' => 'required|string|max:255|unique:kategori_pakaians,kategori_pakaian_nama',
        ]);

        $kategori = KategoriPakaian::create([
            'kategori_pakaian_id' => Str::uuid(),
            'kategori_pakaian_nama' => $request->kategori_pakaian_nama,
        ]);

        return response()->json(['message' => 'Kategori Pakaian created successfully', 'kategori' => $kategori], 201);
    }

    // PUT /api/admin/kategori-pakaian/{id}
    public function updateKategoriPakaian(Request $request, $id)
    {
        $kategori = KategoriPakaian::find($id);
        if (!$kategori) {
            return response()->json(['message' => 'Kategori Pakaian not found'], 404);
        }

        $request->validate([
            'kategori_pakaian_nama' => 'required|string|max:255|unique:kategori_pakaians,kategori_pakaian_nama,' . $id . ',kategori_pakaian_id',
        ]);

        $kategori->update([
            'kategori_pakaian_nama' => $request->kategori_pakaian_nama,
        ]);

        return response()->json(['message' => 'Kategori Pakaian updated successfully', 'kategori' => $kategori]);
    }

    // DELETE /api/admin/kategori-pakaian/{id}
    public function destroyKategoriPakaian($id)
    {
        $kategori = KategoriPakaian::find($id);
        if (!$kategori) {
            return response()->json(['message' => 'Kategori Pakaian not found'], 404);
        }

        $kategori->delete();

        return response()->json(['message' => 'Kategori Pakaian deleted successfully']);
    }
}
