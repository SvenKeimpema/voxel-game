import * as THREE from 'three';
import Player from './entities/player.js';
import { Timer } from 'three/addons/misc/Timer.js';
import World from './voxels/world';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const html_canvas = document.getElementById("game_screen");

const renderer = new THREE.WebGLRenderer({canvas: html_canvas});
const canvas = renderer.domElement;

const world = new World(scene);
world.generateWorld();

const player = new Player(world, camera);

addEventListener("click", e => {
    canvas.requestPointerLock({
        unadjustedMovement: true,
    });
})

const timer = new Timer();

function CreateRenderer() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function animate(timestamp) {
	requestAnimationFrame( animate );

    timer.update(timestamp);

    player.update_player_movement(timer.getDelta());
    world.checkViewDistance(player._translation);

	renderer.render( scene, camera );
}

CreateRenderer();
animate();