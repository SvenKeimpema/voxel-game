<?php

    namespace App\Events;

    use App\Broadcasting\TestChannel;
    use App\Broadcasting\WorldChannel;
    use Illuminate\Broadcasting\PrivateChannel;
    use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

    class TestEvent implements ShouldBroadcast
    {
        public string $server_uuid;

        public function __construct(string $server_uuid)
        {
            $this->server_uuid = $server_uuid;
        }

        public function broadcastAs(): string
        {
            return "test";
        }

        /**
         * @inheritDoc
         */
        public function broadcastOn(): TestChannel
        {
            return new TestChannel();
        }
    }
