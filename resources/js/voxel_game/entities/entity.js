import * as THREE from 'three';

export default class Entity {
    /**
     *
     * @param {THREE.Scene} scene
     * @param {THREE.Vector3} pos
     */
    constructor(scene, pos) {

        this.scene = scene;
        this.pos = pos;

        this.geo = new THREE.SphereGeometry(0.5, 32, 16);
        this.mat = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        this.sphere = new THREE.Mesh(this.geo, this.mat);
        this.sphere.position.set(this.pos.x, this.pos.y, this.pos.z);
        this.scene.add(this.sphere);
    }

    updatePosition(pos) {
        this.sphere.position.set(pos.x, pos.y, pos.z);
    }
}
