<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\MetodePembayaran;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pembelian>
 */
class PembelianFactory extends Factory
{
    public function definition()
    {
        return [
            'pembelian_id' => $this->faker->uuid(),
            'pembelian_user_id' => User::factory(),
            'pembelian_metode_pembayaran_id' => MetodePembayaran::factory(),
            'pembelian_tanggal' => $this->faker->dateTime(),
            'pembelian_total_harga' => $this->faker->numberBetween(100000, 1000000),
            'pembelian_alamat' => $this->faker->address(),
            'pembelian_catatan' => $this->faker->optional()->sentence(),
        ];
    }
}
