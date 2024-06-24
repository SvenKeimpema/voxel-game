import axios from 'axios'

export class Server {
    constructor() {
        this.uuid = document.getElementById("world_uuid").innerHTML;
        window.Echo.private(`world.${this.uuid}`).listen('.PlayerAddedEvent', function (e, data) {
            console.log(e, data);
        })

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

    call(event, kwargs={}) {
        kwargs["event"] = event;
        kwargs["X-Socket-ID"] = window.Echo.socketId();
        kwargs["server_uuid"] = this.uuid;
        axios.post('/call_event', kwargs).then(r => {});
    }

    call_other(event, kwargs={}) {
        kwargs["event"] = event;
        kwargs["X-Socket-ID"] = window.Echo.socketId();
        kwargs["server_uuid"] = this.uuid;
        axios.post('/call_event_other', kwargs).then(r => {})
    }

    whisper(event, kwargs={}) {
        kwargs["event"] = event;
        kwargs["X-Socket-ID"] = window.Echo.socketId();
        kwargs["server_uuid"] = this.uuid;
        window.Echo.private(`world.${this.uuid}`).whisper('test', kwargs)
    }
}
