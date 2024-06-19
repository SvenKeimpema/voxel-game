<?php

namespace App\Broadcasting;

use App\Models\Connection;
use App\Models\User;
use Laravel\Reverb\Loggers\Log;

class WorldChannel
{

    public function __construct()
    {
    }

    /**
     * Authenticate the user's access to the channel.
     */
    public function join(User $user, string $world_uuid): array|bool
    {
        $user = Connection::where(["user_id" => $user->id, "world_uuid" => $world_uuid])->get();
        info($user);
        return $user->count() !== 0;
    }
}
