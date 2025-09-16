<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KategoriPakaian extends Model
{
    use HasFactory;

    protected $primaryKey = 'kategori_pakaian_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kategori_pakaian_nama',
    ];

    public function pakaians()
    {
        return $this->hasMany(Pakaian::class, 'pakaian_kategori_pakaian_id', 'kategori_pakaian_id');
    }
}
