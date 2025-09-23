<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePakaianRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'pakaian_kategori_pakaian_id' => 'required|uuid|exists:kategori_pakaians,kategori_pakaian_id',
            'pakaian_nama' => 'required|string|max:50',
            'pakaian_harga' => 'required|string|max:50',
            'pakaian_stok' => 'required|string|max:100',
            'pakaian_gambar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'pakaian_kategori_pakaian_id.required' => 'Kategori pakaian harus dipilih.',
            'pakaian_kategori_pakaian_id.exists' => 'Kategori pakaian tidak ditemukan.',
            'pakaian_nama.required' => 'Nama pakaian harus diisi.',
            'pakaian_nama.max' => 'Nama pakaian maksimal 50 karakter.',
            'pakaian_harga.required' => 'Harga pakaian harus diisi.',
            'pakaian_stok.required' => 'Stok pakaian harus diisi.',
            'pakaian_gambar.required' => 'Gambar pakaian harus diupload.',
            'pakaian_gambar.image' => 'File harus berupa gambar.',
            'pakaian_gambar.mimes' => 'Gambar harus berformat jpeg, png, jpg, atau gif.',
            'pakaian_gambar.max' => 'Ukuran gambar maksimal 2MB.',
        ];
    }
}
