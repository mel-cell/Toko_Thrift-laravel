<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'user_username',
        'user_password',
        'user_fullname',
        'user_email',
        'user_nohp',
        'user_alamat',
        'user_profil_url',
        'user_level',
    ];

    protected $hidden = [
        'user_password',
        'remember_token',
    ];

    protected $casts = [
        'user_level' => 'string',
    ];

    public function setUserPasswordAttribute($value)
    {
        $this->attributes['user_password'] = bcrypt($value);
    }

    public function isAdmin()
    {
        return $this->user_level === 'Admin';
    }

    public function isPengguna()
    {
        return $this->user_level === 'Pengguna';
    }

    public function getAuthPassword()
    {
        return $this->user_password;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (empty($user->user_id)) {
                $user->user_id = Str::uuid();
            }
        });
    }

    public function metodePembayarans()
    {
        return $this->hasMany(MetodePembayaran::class, 'metode_pembayaran_user_id', 'user_id');
    }

    public function pembelians()
    {
        return $this->hasMany(Pembelian::class, 'pembelian_user_id', 'user_id');
    }
}
