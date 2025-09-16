<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    public function definition()
    {
        return [
            'user_id' => $this->faker->uuid(),
            'user_username' => $this->faker->unique()->userName(),
            'user_password' => bcrypt('password'), // default password
            'user_fullname' => $this->faker->name(),
            'user_email' => $this->faker->unique()->safeEmail(),
            'user_nohp' => $this->faker->numerify('08##########'),
            'user_alamat' => $this->faker->address(),
            'user_profil_url' => 'url_placeholder_profil',
            'user_level' => 'Pengguna', // Default to Pengguna for all generated users
        ];
    }
}
