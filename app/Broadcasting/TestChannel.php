<?php

    namespace App\Broadcasting;

    use App\Models\Connection;
    use App\Models\User;

    class TestChannel
    {
        public function __construct()
        {
        }

        /**
         * Authenticate the user's access to the channel.
         */
        public function join(User $user): array|bool
        {
            return true;
        }
    }
