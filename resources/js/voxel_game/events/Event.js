import {Server} from "../server.js";

/**
 * Event going outbound from the game
 */
export class GameEvent {
    static event_calls = {}

    static bind(event_name, delay, kwargs) {
        if(event_name in GameEvent.event_calls) {
            if(Date.now() - GameEvent.event_calls[event_name] > delay) {
                Server.whisper(event_name, kwargs);
            }
        }
        GameEvent.event_calls[event_name] = Date.now();
    }
}

/**
 * Event incoming from the server
 */
export class ServerEvent {

    run(GameInstance, EventData) {

    }

}
