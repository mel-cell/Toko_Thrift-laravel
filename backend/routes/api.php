<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

use App\Http\Controllers\PakaianController;
use App\Http\Controllers\PembelianController;
use App\Http\Controllers\AdminPakaianController;
use App\Http\Controllers\AdminPembelianController;
use App\Http\Controllers\AdminUserController;

// Public routes
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/pakaian', [PakaianController::class, 'index']);
Route::get('/pakaian/search', [PakaianController::class, 'search']);
Route::get('/pakaian/{id}', [PakaianController::class, 'show']);
Route::get('/kategori-pakaian', [PakaianController::class, 'kategoriPakaian']);

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});


// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/metode-pembayaran', [PembelianController::class, 'getMetodePembayaran']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Pengguna routes
    Route::middleware('checkrole:Pengguna')->group(function () {
        Route::post('/pembelian', [PembelianController::class, 'store']);
        Route::get('/pembelian', [PembelianController::class, 'index']);
        Route::get('/pembelian/{id}', [PembelianController::class, 'show']);
        Route::put('/pembelian/{id}/cancel', [PembelianController::class, 'cancel']);
        Route::put('/akun', [PembelianController::class, 'updateAkun']);
    });

    // Admin routes
    Route::middleware('checkrole:Admin')->prefix('admin')->group(function () {
        Route::apiResource('users', AdminUserController::class);
        Route::post('/pakaian', [AdminPakaianController::class, 'storePakaian']);
        Route::get('/pakaian', [AdminPakaianController::class, 'indexPakaian']);
        Route::get('/pakaian/{id}', [AdminPakaianController::class, 'showPakaian']);
        Route::put('/pakaian/{id}', [AdminPakaianController::class, 'updatePakaian']);
        Route::delete('/pakaian/{id}', [AdminPakaianController::class, 'destroyPakaian']);

        Route::post('/kategori-pakaian', [AdminPakaianController::class, 'storeKategoriPakaian']);
        Route::put('/kategori-pakaian/{id}', [AdminPakaianController::class, 'updateKategoriPakaian']);
        Route::delete('/kategori-pakaian/{id}', [AdminPakaianController::class, 'destroyKategoriPakaian']);

        Route::get('/pembelian', [AdminPembelianController::class, 'indexPembelian']);
        Route::get('/pembelian/{id}', [AdminPembelianController::class, 'showPembelian']);
        Route::put('/pembelian/{id}/status', [AdminPembelianController::class, 'updateStatus']);
        Route::get('/stats', [AdminPembelianController::class, 'stats']);
    });
});
