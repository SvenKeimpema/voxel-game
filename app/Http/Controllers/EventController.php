<?php

    namespace App\Http\Controllers;

    use App\Events\PlayerAddedEvent;
    use App\Events\PlayerLeaveEvent;
    use App\Events\UpdateMovementEvent;
    use App\Models\Connection;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Auth;

    class EventController extends Controller
    {
        static array $events = [
            "PlayerAddedEvent" => PlayerAddedEvent::class,
            "PlayerLeaveEvent" => PlayerLeaveEvent::class,
        ];

        public function get_event(Request $request)
        {
            $r_data = $request->validate([
                'event' => ['required', 'string'],
            ]);

            $event = $r_data["event"];

            return EventController::$events[$event];
        }

        public static function update_connection()
        {
            // update auth id to the same so laravel updates the time stamp for use(little hack)
            Connection::where("user_id", Auth::id())->update(["user_id" => Auth::id()]);
        }

        public function call(Request $request): void
        {
            $this->update_connection();
            $event = $this->get_event($request);
            $event::dispatch($request);
        }

        public function call_other(Request $request): void
        {
            $this->update_connection();
            $event = $this->get_event($request);
            broadcast(new $event($request))->toOthers();
        }
    }
