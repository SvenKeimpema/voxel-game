<?php

    use App\Http\Controllers\GameController;
    use App\Http\Controllers\ProfileController;
    use App\Http\Controllers\ServerController;
    use Illuminate\Support\Facades\Route;

Route::get('/',  [ServerController::class, 'get_servers'])->name('servers');
Route::post('/create_private_server', [ServerController::class, 'create_private_server'])->name('create_private_server');
Route::get('/create_server', [ServerController::class, 'create_server_form'])->name('create_server_form');
Route::get('/join_server', [ServerController::class, 'join_private_server_form'])->name('join_private_server_form');
Route::get('/play_game', [GameController::class, 'play'])->name('play_game');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
