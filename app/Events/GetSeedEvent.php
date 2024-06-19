<?php

    namespace App\Events;

    use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

    class GetSeedEvent implements ShouldBroadcast
    {

        /**
         * @inheritDoc
         */
        public function broadcastOn()
        {
            // TODO: Implement broadcastOn() method.
        }
    }
