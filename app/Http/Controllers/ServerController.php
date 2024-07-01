<?php

    namespace App\Http\Controllers;

    use App\Events\PlayerAddedEvent;
    use App\Models\Connection;
    use App\Models\Server;
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
            Connection::create(["world_uuid" => $uuid, "user_id" => $user_id]);
        }

        public function server_exists(string $uuid) {
            $server = Server::where("uuid", $uuid)->get();
            return count($server) != 0;
        }

        public function connection_exists(int $auth_id)
        {
            $conns = Connection::where("user_id", $auth_id)->get();
            return count($conns) != 0;
        }

        public function remove_connection(int $auth_id) {
            Connection::where("user_id", $auth_id)->delete();
        }

        public function setup_connection($auth_id, $uuid)
        {
            info("id:");
            info($auth_id);
            if($this->connection_exists($auth_id))
                $this->remove_connection($auth_id);

            $this->create_connection($uuid, $auth_id);
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
            $this->setup_connection($create_data['created_by'], $create_data['uuid']);

            session(["game_code" => $create_data['uuid']]);

            return redirect(route('play_game'));
        }

        public function join_private_server(Request $request)
        {
            $data = $request->validate([
                'server_code' => ['required', 'string'],
            ]);

            if(!$this->server_exists($data['server_code']))
                redirect(route('join_private_server_form'));

            session(["game_code" => $data['server_code']]);
            $this->setup_connection(Auth::id(), $data['server_code']);

            return redirect(route('play_game'));
        }

        /**
         * whenever user pings the server we want to make sure the connection stays alive
         * @param Request $request
         * @return void
         */
        public function ping(Request $request) {
            EventController::update_connection();
        }
    }
