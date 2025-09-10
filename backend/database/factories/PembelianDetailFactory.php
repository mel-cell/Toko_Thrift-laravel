<?php

namespace Database\Factories;

use App\Models\Pembelian;
use App\Models\Pakaian;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PembelianDetail>
 */
class PembelianDetailFactory extends Factory
{
    public function definition()
    {
        return [
            'pembelian_detail_id' => $this->faker->uuid(),
            'pembelian_detail_pembelian_id' => Pembelian::factory(),
            'pembelian_detail_pakaian_id' => Pakaian::factory(),
            'pembelian_detail_jumlah' => $this->faker->numberBetween(1, 10),
            'pembelian_detail_total_harga' => $this->faker->numberBetween(10000, 100000),
        ];
    }
}
