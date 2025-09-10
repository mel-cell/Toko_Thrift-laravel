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
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('user_id')->primary();
            $table->string('user_username', 50)->unique();
            $table->string('user_password', 255);
            $table->string('user_fullname', 100);
            $table->string('user_email', 50);
            $table->char('user_nohp', 13);
            $table->string('user_alamat', 200);
            $table->string('user_profil_url', 255)->default('url_placeholder_profil');
            $table->enum('user_level', ['Admin', 'Pengguna']);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
