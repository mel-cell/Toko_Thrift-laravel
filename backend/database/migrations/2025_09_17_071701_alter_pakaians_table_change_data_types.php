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
        Schema::table('pakaians', function (Blueprint $table) {
            $table->decimal('pakaian_harga', 10, 2)->change();
            $table->integer('pakaian_stok')->change();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pakaians', function (Blueprint $table) {
            $table->string('pakaian_harga', 50)->change();
            $table->string('pakaian_stok', 100)->change();
            $table->dropSoftDeletes();
        });
    }
};
