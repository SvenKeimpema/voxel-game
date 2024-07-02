
import {Game} from '../game.js';
import PlayerAddedEvent from "./PlayerAddedEvent.js";
import PlayerMovedEvent from "./PlayerMovedEvent.js";

export class EventManager {
    /**
     *
     * @param {Game} game
     */
    constructor(game) {
        this.game = game;
        this.events = {};

        this.register_default_hooks();
    }

    register_default_hooks() {
        this.register("PlayerAddedEvent", PlayerAddedEvent);
        this.register("PlayerMovedEvent", PlayerMovedEvent);
    }

    register(event, callback) {
        this.events[".client-" + event] = callback;
    }

    call(event, event_data) {
        const cls = new this.events[event]();
        cls.run(this.game, event_data);
    }
}

