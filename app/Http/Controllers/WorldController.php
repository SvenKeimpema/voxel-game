<?php
    namespace App\Http\Controllers;
    use App\Http\Controllers\Controller;
    use App\Models\World;
    use Illuminate\Broadcasting\InteractsWithBroadcasting;
    use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
    use Illuminate\Support\Facades\Session;

    class WorldController extends Controller {
        use InteractsWithBroadcasting;

        /**
         * gets the seed of the world, if the seed does NOT exist we create a fresh seed.
         * @return int
         */
        public function get_seed() {
            $server_uuid = Session::get("game_code");
            $seed = World::where("server_uuid", $server_uuid)->get();

            if($seed->count() == 0) {
//              maximum seed needs to below MAX_INTEGER_LENGTH, 2^31 is chosen for now since it won't overflow
//              even if the machine is using 32 bit
                $seed = rand(0, 2^31);
                World::create(["server_uuid"=>$server_uuid, "seed"=>$seed]);
            }

            return $seed;
        }
    }
