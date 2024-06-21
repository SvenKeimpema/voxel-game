<?php

    use App\Broadcasting\WorldChannel;
    use Illuminate\Support\Facades\Broadcast;

    Broadcast::channel('world.{world_uuid}', WorldChannel::class);
