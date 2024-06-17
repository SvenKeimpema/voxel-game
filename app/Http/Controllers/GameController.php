<?php

    namespace App\Http\Controllers;

    use App\Events\PlayerAddedEvent;
    use Illuminate\Http\Request;
    use App\Http\Controllers\Controller;
    use Illuminate\Support\Facades\Auth;
    use Illuminate\Support\Facades\Session;
    use Illuminate\Validation\ValidationException;

    class GameController extends Controller
    {
        /**
         * MAIN GAME
         * @throws ValidationException
         */
        public function play() {
            if(Session::get('game_code') == null) {
                throw ValidationException::withMessages([
                    "uuid" => null,
                ]);
            }

            $server_uuid = Session::get('game_code');

            broadcast(new PlayerAddedEvent($server_uuid))->toOthers();

            return view("game",
                [
                    "uuid" => $server_uuid
                ]);
        }
    }
