<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pakaians', function (Blueprint $table) {
            $table->uuid('pakaian_id')->primary();
            $table->uuid('pakaian_kategori_pakaian_id');
            $table->string('pakaian_nama', 50);
            $table->string('pakaian_deskrsipsi', 255);
            $table->string('pakaian_size', 10);
            $table->string('pakaian_harga', 50);
            $table->string('pakaian_stok', 100);
            $table->string('pakaian_gambar_url', 255);
            $table->timestamps();

            $table->foreign('pakaian_kategori_pakaian_id')->references('kategori_pakaian_id')->on('kategori_pakaians')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pakaians');
    }
};
