<?php

    namespace App\Http\Controllers;

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

            return view("game",
                [
                    "uuid" => $server_uuid
                ]);
        }
    }
