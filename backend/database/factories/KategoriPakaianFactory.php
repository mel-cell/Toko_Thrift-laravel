<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\KategoriPakaian>
 */
class KategoriPakaianFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kategori_pakaian_id' => $this->faker->uuid(), 
            'kategori_pakaian_nama' => $this->faker->unique()->word(),
        ];
    }
}
