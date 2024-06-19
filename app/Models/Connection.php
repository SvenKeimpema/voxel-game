<?php

    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class Connection extends Model
    {
        use HasFactory;

        protected $fillable = ['world_uuid', 'user_id', 'updated_at'];
    }
