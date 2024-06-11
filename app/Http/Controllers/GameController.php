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
         * @throws ValidationException
         */
        public function play() {
            if(Session::get('game_code') == null) {
                throw ValidationException::withMessages([
                    "uuid" => null,
                ]);
            }
            $user_name = "";
            if(Auth::check()) {

            }else {

            }

            return Session::get('game_code');
        }
    }
