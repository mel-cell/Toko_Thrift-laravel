<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pakaian extends Model
{
    use HasFactory;

    protected $primaryKey = 'pakaian_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'pakaian_kategori_pakaian_id',
        'pakaian_nama',
        'pakaian_deskrsipsi',
        'pakaian_size',
        'pakaian_harga',
        'pakaian_stok',
        'pakaian_gambar_url',
    ];

    public function kategoriPakaian()
    {
        return $this->belongsTo(KategoriPakaian::class, 'pakaian_kategori_pakaian_id', 'kategori_pakaian_id');
    }

    public function pembelianDetails()
    {
        return $this->hasMany(PembelianDetail::class, 'pembelian_detail_pakaian_id', 'pakaian_id');
    }
}
