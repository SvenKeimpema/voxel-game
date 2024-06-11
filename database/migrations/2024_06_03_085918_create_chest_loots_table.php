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
        Schema::create('chest_loot', function (Blueprint $table) {
            $table->id();
            $table->integer('chest_id');
            $table->integer('item_id');
            $table->timestamps();
        });

        Schema::table('inventories', function (Blueprint $table) {
            $table->foreign('chest_id')->references('id')->on('chests')->onDelete('cascade');
            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chest_loot');
    }
};
