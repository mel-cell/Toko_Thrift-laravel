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
        KategoriPakaian::factory(20)->create();
        Pakaian::factory(20)->create();
        User::factory(20)->create();
        MetodePembayaran::factory(20)->create();
        Pembelian::factory(20)->create();
        PembelianDetail::factory(20)->create();
    }
}
