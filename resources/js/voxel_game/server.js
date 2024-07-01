import axios from 'axios'
import {EventManager} from "./events/EventManager.js";

const uuid = document.getElementById("world_uuid").innerHTML;
const channel = window.Echo.private(`world.${uuid}`);

export class Server {
    constructor(game) {


        this.event_manager = new EventManager(game);
        this.game = game;

        setTimeout(() =>
            this.whisper(
                "PlayerAddedEvent",
                {"position": this.game.player.position, "e-uuid": this.game.entity_uuid
                }),
        1000);

        this.listenForWhisperEvents();
    }

    call_url(url, kwargs={}) {
        kwargs["server_uuid"] = this.uuid;
        axios.post(url, kwargs).then(r => {});
    }

    static whisper(event, kwargs={}) {
        kwargs["server_uuid"] = this.uuid;
        channel.whisper(event, kwargs)
    }

    /**
     * given function will be called whenever the given event is called.
     * this is basically a hook function.
     */
    listenForWhisperEvents() {
        channel.listenToAll((event, data) => this.event_manager.call(event, data));
    }
}
