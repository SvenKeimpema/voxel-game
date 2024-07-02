<?php

    use App\Http\Controllers\EventController;
    use App\Http\Controllers\GameController;
    use App\Http\Controllers\ProfileController;
    use App\Http\Controllers\ServerController;
    use App\Http\Controllers\WorldController;
    use Illuminate\Support\Facades\Route;

// home
Route::get('/',  [ServerController::class, 'get_servers'])->name('servers');

//game routes
Route::post('/create_private_server', [ServerController::class, 'create_private_server'])->name('create_private_server');
Route::post('/join_private_server', [ServerController::class, 'join_private_server'])->name('join_private_server');
Route::get('/create_server', [ServerController::class, 'create_server_form'])->name('create_server_form');
Route::get('/join_server', [ServerController::class, 'join_private_server_form'])->name('join_private_server_form');
Route::get('/play_game', [GameController::class, 'play'])->name('play_game');

// auth
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// event route
Route::post('/call_event', [EventController::class, 'call'])->name('call_event');
Route::post('/call_event_other', [EventController::class, 'call_other'])->name('call_event_other');

// ping server route
Route::post('/ping', [ServerController::class, 'ping'])->name('ping');
Route::post('/get_seed', [WorldController::class, 'get_seed'])->name('seed');

require __DIR__.'/auth.php';
