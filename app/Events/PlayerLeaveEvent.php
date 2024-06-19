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

    class PlayerLeaveEvent implements ShouldBroadcast
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

        public function broadcastAs(): string
        {
            return "PlayerLeaveEvent";
        }

        /**
         * @inheritDoc
         */
        public function broadcastOn(): PrivateChannel
        {
            return new PrivateChannel("world.".$this->server_uuid);
        }
    }
