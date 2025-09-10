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
        Schema::create('pembelian_details', function (Blueprint $table) {
            $table->uuid('pembelian_detail_id')->primary();
            $table->uuid('pembelian_detail_pembelian_id');
            $table->uuid('pembelian_detail_pakaian_id');
            $table->integer('pembelian_detail_jumlah');
            $table->integer('pembelian_detail_total_harga');
            $table->timestamps();

            $table->foreign('pembelian_detail_pembelian_id')->references('pembelian_id')->on('pembelians')->onDelete('cascade');
            $table->foreign('pembelian_detail_pakaian_id')->references('pakaian_id')->on('pakaians')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembelian_details');
    }
};
