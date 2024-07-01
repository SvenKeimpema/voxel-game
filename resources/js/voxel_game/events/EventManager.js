
import {Game} from '../game.js';

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
        this.register("PlayerAddedEvent", this.game.createEntity);
    }

    register(event, callback) {
        callback.bind(this.game);
        this.events[".client-" + event] = callback;
    }

    call(event, event_data) {
        this.events[event].run(this.game, event_data);
    }
}

