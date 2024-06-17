<?php

    namespace App\Http\Controllers;

    use App\Http\Controllers\Controller;
    use App\Models\Connection;
    use App\Models\Server;
    use App\Models\World;
    use Illuminate\Support\Facades\Auth;
    use Illuminate\Support\Facades\DB;
    use Illuminate\Http\Request;
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

        public function create_connection(string $uuid, int $user_id)
        {
            Connection::create($uuid, $user_id);
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
            $this->create_connection($create_data['uuid'], $create_data['user_id']);

            session(["game_code" => $create_data['uuid']]);

            return redirect(route('play_game'));
        }

        public function join_private_server(Request $request)
        {
            $data = $request->validate([
                'uuid' => ['required', 'string'],
            ]);

            session(["game_code" => $data['uuid']]);
            $this->create_connection($data['uuid'], Auth::id());

            return redirect(route('play_game'));
        }

        // TODO: remove from class whenever memorized
        public function test() {
            return view("hello", ['index'=>1]);
        }
    }
