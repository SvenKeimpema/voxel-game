<?php

    namespace App\Events;

    use App\Broadcasting\WorldChannel;
    use Illuminate\Broadcasting\PrivateChannel;
    use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

    class PlayerAddedEvent implements ShouldBroadcast
    {
        public string $server_uuid;

        public function __construct(string $server_uuid)
        {
            $this->server_uuid = $server_uuid;
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
            return new PrivateChannel("world.");
        }
    }
