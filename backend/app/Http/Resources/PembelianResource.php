<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PembelianResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->pembelian_id,
            'user_id' => $this->pembelian_user_id,
            'metode_pembayaran_id' => $this->pembelian_metode_pembayaran_id,
            'tanggal' => $this->pembelian_tanggal,
            'total_harga' => $this->pembelian_total_harga,
            'status' => $this->pembelian_status,
            'details' => PembelianDetailResource::collection($this->whenLoaded('pembelianDetails')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
