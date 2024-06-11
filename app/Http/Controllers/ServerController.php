<?php

    namespace App\Http\Controllers;

    use App\Http\Controllers\Controller;
    use App\Models\Server;
    use Illuminate\Support\Facades\Auth;
    use Illuminate\Support\Facades\DB;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Session;
    use Illuminate\Support\Str;

    class ServerController extends Controller {
        public function get_servers() {
            $servers = DB::table('servers')->where('private', 0)->get();
            return view ("home", ['servers'=>$servers]);
        }

        public function create_server_form() {
            return view ("create_server");
        }

        public function join_private_server_form() {
            return view ("join_private_server");
        }

        public function create_private_server(Request $request) {
            $create_data = [];

            $data = $request->validate([
                'server_name' => ['required', 'string'],
            ]);

            $create_data['name'] = $data['server_name'];
            $create_data['private'] = 1;
            $create_data['uuid'] = Str::uuid();
            $create_data['created_by'] = Auth::id();

            Server::create($create_data);

            session(["game_code" => $create_data['uuid']]);

            return redirect(route('play_game'));
        }

        // TODO: remove from class whenever memorized
        public function test() {
            return view("hello", ['index'=>1]);
        }
    }
