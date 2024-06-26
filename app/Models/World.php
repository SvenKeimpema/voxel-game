<?php

    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class World extends Model
    {
        use HasFactory;

        protected $fillable = ['server_uuid', 'world_seed'];
    }
