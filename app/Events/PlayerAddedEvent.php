<?php

    namespace App\Events;

    use App\Broadcasting\WorldChannel;
    use Illuminate\Broadcasting\PrivateChannel;
    use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
    use Illuminate\Broadcasting\InteractsWithSockets;
    use Illuminate\Foundation\Events\Dispatchable;
    use Illuminate\Http\Request;
    use Illuminate\Queue\SerializesModels;
    use Illuminate\Support\Facades\Auth;

    class PlayerAddedEvent implements ShouldBroadcast
    {
        use Dispatchable, InteractsWithSockets, SerializesModels;
        public string $server_uuid;

        public function __construct(Request $request)
        {
            $request->validate(["server_uuid" => "required"]);
            $server_uuid = $request['server_uuid'];

            $this->server_uuid = $server_uuid;
            $this->dontBroadcastToCurrentUser();
        }

        public function broadcastWith(): array
        {
            $arr = [];

            for($i = 0; $i < 100; $i++) {
                $arr[$i] = rand(0, 100000);
            }

            return $arr;
        }

        public function broadcastAs(): string
        {
            return "PlayerAddedEvent";
        }

        /**
         * @inheritDoc
         */
        public function broadcastOn(): PrivateChannel
        {
            return new PrivateChannel("world.".$this->server_uuid);
        }
    }
