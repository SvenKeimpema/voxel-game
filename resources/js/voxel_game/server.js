import axios from 'axios'
import {EventManager} from "./events/EventManager.js";

const uuid = document.getElementById("world_uuid").innerHTML;
const channel = window.Echo.private(`world.${uuid}`);

export class Server {
    static entity_uuid = null;

    constructor(game) {
        this.event_manager = new EventManager(game);
        this.game = game;
        Server.entity_uuid = this.game.entity_uuid;

        setTimeout(() =>
            Server.whisper(
                "PlayerAddedEvent",
                {"position": this.game.player.position}),
        1000);

        this.listenForWhisperEvents();
    }

    call_url(url, kwargs={}) {
        kwargs["server_uuid"] = this.uuid;
        axios.post(url, kwargs).then(r => {});
    }

    static whisper(event, kwargs={}) {
        kwargs["server_uuid"] = this.uuid;
        kwargs["e-uuid"] = Server.entity_uuid;
        channel.whisper(event, kwargs)
    }

    /**
     * given function will be called whenever the given event is called.
     * this is basically a hook function.
     */
    listenForWhisperEvents() {
        const callback = this.event_manager.call.bind(this.event_manager);
        channel.listenToAll((event, data) => callback(event, data));
    }
}
