<?php

namespace App\Http\Controllers;

use App\Models\Pakaian;
use App\Models\KategoriPakaian;
use App\Models\MetodePembayaran;
use App\Http\Resources\PakaianResource;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Products",
 *     description="API endpoints for products (pakaian)"
 * )
 */
class PakaianController extends Controller
{
    /**
     * @OA\Get(
     *     path="/pakaian",
     *     summary="Get list of products",
     *     tags={"Products"},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search term for name, description, or category",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="kategori",
     *         in="query",
     *         description="Filter by category name",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Items per page",
     *         @OA\Schema(type="integer", default=10)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of products",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/PakaianResource")),
     *             @OA\Property(property="links", type="object"),
     *             @OA\Property(property="meta", type="object")
     *         )
     *     )
     * )
     */
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

    /**
     * @OA\Get(
     *     path="/pakaian/{id}",
     *     summary="Get product by ID",
     *     tags={"Products"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Product ID",
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product details",
     *         @OA\JsonContent(ref="#/components/schemas/PakaianResource")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Product not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Pakaian not found")
     *         )
     *     )
     * )
     */
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
