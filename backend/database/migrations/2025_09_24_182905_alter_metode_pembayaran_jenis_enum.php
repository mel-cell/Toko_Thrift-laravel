<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE metode_pembayarans MODIFY COLUMN metode_pembayaran_jenis VARCHAR(50) NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE metode_pembayarans MODIFY COLUMN metode_pembayaran_jenis ENUM('DANA', 'OVO', 'BCA', 'COD') NOT NULL");
    }
};
