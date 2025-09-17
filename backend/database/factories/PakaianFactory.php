<?php

namespace Database\Factories;

use App\Models\KategoriPakaian;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pakaian>
 */
class PakaianFactory extends Factory
{
    public function definition()
    {
        return [
            'pakaian_id' => $this->faker->uuid(),
            'pakaian_kategori_pakaian_id' => KategoriPakaian::factory(),
            'pakaian_nama' => $this->faker->word(),
            'pakaian_deskrsipsi' => $this->faker->sentence(),
            'pakaian_size' => $this->faker->randomElement(['S', 'M', 'L', 'XL']),
            'pakaian_harga' => $this->faker->numberBetween(10000, 100000),
            'pakaian_stok' => $this->faker->numberBetween(1, 100),
            'pakaian_gambar_url' => $this->faker->imageUrl(640, 480, 'fashion'),
        ];
    }
}
