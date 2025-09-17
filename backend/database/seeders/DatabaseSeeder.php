<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\KategoriPakaian;
use App\Models\Pakaian;
use App\Models\User;
use App\Models\MetodePembayaran;
use App\Models\Pembelian;
use App\Models\PembelianDetail;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 10 categories
        KategoriPakaian::factory(10)->create();

        // Create 10 payment methods
        MetodePembayaran::factory(10)->create();

        // Create 10 users (5 Admin, 5 Pengguna)
        User::factory()->count(2)->create(['user_level' => 'Admin']);
        User::factory()->count(8)->create(['user_level' => 'Pengguna']);

        // Create 10 products
        Pakaian::factory(10)->create();

        // Create 10 purchases with details
        Pembelian::factory(10)->create()->each(function ($pembelian) {
            PembelianDetail::factory(rand(1, 3))->create(['pembelian_detail_pembelian_id' => $pembelian->pembelian_id]);
        });
    }
}
