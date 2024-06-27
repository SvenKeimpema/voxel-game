import axios from 'axios'

export class Server {
    constructor() {
        this.uuid = document.getElementById("world_uuid").innerHTML;
        this.channel = window.Echo.private(`world.${this.uuid}`)
        window.Echo.private(`world.${this.uuid}`).listen('.PlayerMovedEvent', function (e, data) {
        })
        window.Echo.private(`world.${this.uuid}`).listenToAll((event, data) => {
            // do what you need to do based on the event name and data
        });

        window.Echo.private(`world.${this.uuid}`).listenForWhisper('test', (e) => {
            console.log(e);
        });

        // this.call_other("PlayerAddedEvent");
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
        window.Echo.private(`world.${this.uuid}`).whisper('test', kwargs)
    }

    /**
     * given function will be called whenever the given event is called.
     * this is basically a hook function.
     * @param event
     * @param func
     */
    listenForWhisper(event, func) {
        this.channel.listen(event, func);
    }
}
