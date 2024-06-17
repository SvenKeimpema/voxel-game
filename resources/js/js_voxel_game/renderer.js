import * as THREE from "three";

export class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({canvas: canvas});
        this.setup();
    }

    setup() {
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
    }

    render(scene, camera) {
        this.renderer.render(scene, camera);
    }
}
