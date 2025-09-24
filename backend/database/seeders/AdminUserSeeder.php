<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'user_username' => 'admin',
            'user_password' => Hash::make('Password123!'),
            'user_fullname' => 'Admin User',
            'user_email' => 'admin@tugva.org',
            'user_nohp' => '081234567890',
            'user_alamat' => 'Admin Address',
            'user_level' => 'Admin',
        ]);
    }
}
