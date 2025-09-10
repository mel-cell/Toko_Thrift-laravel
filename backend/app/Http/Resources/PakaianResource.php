<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PakaianResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->pakaian_id,
            'nama' => $this->pakaian_nama,
            'harga' => $this->pakaian_harga,
            'stok' => $this->pakaian_stok,
            'gambar_url' => $this->pakaian_gambar_url,
            'kategori' => $this->whenLoaded('kategoriPakaian', function () {
                return [
                    'id' => $this->kategoriPakaian->kategori_pakaian_id,
                    'nama' => $this->kategoriPakaian->kategori_pakaian_nama,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
