<?php
    namespace App\Models;
    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;
    Class Server extends Model {
        use HasFactory;

        protected $fillable = ['name', 'uuid', 'created_by', 'private'];
    }
