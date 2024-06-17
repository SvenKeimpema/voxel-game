import {GameRenderer} from "./renderer.js";
import { Timer } from 'three/addons/misc/Timer.js';
import Player from "./entities/player.js";
import World from "./voxels/world.js";

export class Game {
    constructor(scene, canvas) {
        this.scene = scene;
        this.renderer = new GameRenderer(canvas);
        this.timer = new Timer();
        this.world = new World(this.scene);
        this.player = new Player(this.world, canvas);

        this.prev_delta = -1;
        this.fps = 0;
        this.setup();
    }

    setup() {
        this.world.generateWorld();
    }

    /**
     * starts the main game loop
     */
    start() {
        // no need to call with delta time, requestAnimationFrame in onUpdate will handle it.
        this.onUpdate();
    }

    onUpdate(deltaTime) {
        requestAnimationFrame(this.onUpdate.bind(this));
        this.timer.update(deltaTime);

        this.player.update_player_movement(this.timer.getDelta());
        this.world.checkViewDistance(this.player.position);

        document.getElementById("pos").innerHTML =
            "posX: " + this.player.position.x +
            "<br>posY: " + this.player.position.y +
            "<br>posZ: " + this.player.position.z;

        this.fps += 1;
        if(deltaTime - this.prev_delta > 1000) {
            document.getElementById("fps").innerHTML = this.fps + " FPS";
            this.fps = 0;
            this.prev_delta = deltaTime;
        }

        this.renderer.render( this.scene, this.player.camera );
    }
}
