export class Server {
    constructor() {
        let uuid = document.getElementById("world_uuid").innerHTML;
        window.Echo.channel(`world.${uuid}`).listen('PlayerJoinedEvent', function (e) {
            console.log(e);
        })
    }
}
