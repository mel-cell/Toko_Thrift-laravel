<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PembelianDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->pembelian_detail_id,
            'pembelian_id' => $this->pembelian_detail_pembelian_id,
            'pakaian_id' => $this->pembelian_detail_pakaian_id,
            'jumlah' => $this->pembelian_detail_jumlah,
            'total_harga' => $this->pembelian_detail_total_harga,
            'pakaian' => new PakaianResource($this->whenLoaded('pakaian')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
