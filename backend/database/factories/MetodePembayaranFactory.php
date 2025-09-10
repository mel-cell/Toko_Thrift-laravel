<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MetodePembayaran>
 */
class MetodePembayaranFactory extends Factory
{
    public function definition()
    {
        return [
            'metode_pembayaran_id' => $this->faker->uuid(),
            'metode_pembayaran_user_id' => User::factory(),
            'metode_pembayaran_jenis' => $this->faker->randomElement(['DANA', 'OVO', 'BCA', 'COD']),
            'metode_pembayaran_nomor' => $this->faker->optional()->numerify('##########'),
        ];
    }
}
