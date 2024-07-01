import axios from 'axios'

export class Server {
    constructor() {
        this.uuid = document.getElementById("world_uuid").innerHTML;
        this.channel = window.Echo.private(`world.${this.uuid}`);

        this.events = {};
        // not sure why but we need to set a TimeOut here before calling this event, else it won't be received?
    }

    call_url(url, kwargs={}) {
        kwargs["X-Socket-ID"] = window.Echo.socketId();
        kwargs["server_uuid"] = this.uuid;
        axios.post(url, kwargs).then(r => {});
    }

    whisper(event, kwargs={}) {
        kwargs["event"] = event;
        kwargs["X-Socket-ID"] = window.Echo.socketId();
        kwargs["server_uuid"] = this.uuid;
        this.channel.whisper(event, kwargs)
    }

    /**
     * given function will be called whenever the given event is called.
     * this is basically a hook function.
     * @param event
     * @param func
     */
    listenForWhisper(event, func) {
        this.channel.listenForWhisper(event, func);
    }
}
