import {Game} from './game.js';
import {Scene} from 'three';
import {Server} from "./server.js";

function main() {
    const scene = new Scene();
    const canvas = document.getElementById("game_screen");
    let game_handler = new Game(scene, canvas);

    game_handler.start();
}

main();
