import * as THREE from 'three';
import InputController from '../helpers/controller.js';
import VoxelData from '../voxels/data.js'
import World from '../voxels/world.js';
import {Server} from "../server.js";
import {GameEvent} from "../events/Event.js";
import {Game} from "../game.js";

class ThridPersonCamera {
    constructor(camera) {
        this.camera = camera;
        this._controller = new InputController();
        this._rotation = new THREE.Quaternion();
        this.position = new THREE.Vector3((VoxelData.worldSizeInChunks*VoxelData.chunkWidth)/2, VoxelData.chunkHeight+2, (VoxelData.worldSizeInChunks*VoxelData.chunkWidth)/2);
        this._phi = 0;
        this._theta = 0;

        // GameEvent.bind("PlayerMovedEvent", this.update)
        console.log()
    }

    update() {
        GameEvent.call("PlayerMovedEvent", 50, {"position": this.position})

        this._updateRotation();
        this._updateCamera();
        this._controller.update();
    }

    _updateCamera() {
        this.camera.quaternion.copy(this._rotation);
        this.camera.position.copy(this.position);
    }

    _updateTranslation(velocity) {
        this.position.add(velocity);
    }

    _getTranslation(dirX, dirY, dirZ, timeElapsed) {
        dirY = -dirY;

        const qx = new THREE.Quaternion();
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._phi);

        const foward = new THREE.Vector3(0, 0, -1);
        foward.applyQuaternion(qx);
        foward.multiplyScalar(dirX * timeElapsed * 10);

        const strafe = new THREE.Vector3(-1, 0, 0);
        strafe.applyQuaternion(qx);
        strafe.multiplyScalar(dirZ * timeElapsed * 10);

        const up = new THREE.Vector3(0, -1, 0);
        up.applyQuaternion(qx);
        up.multiplyScalar(dirY * timeElapsed * 10);

        const move = new THREE.Vector3(0, 0, 0);
        move.add(foward);
        move.add(strafe);
        move.add(up);

        return move;
    }

    _updateRotation() {
        const xh = this._controller._current.mouseXDelta / window.innerWidth;
        const yh = this._controller._current.mouseYDelta / window.innerHeight;
        this._phi += -xh * 5;
        this._theta = THREE.MathUtils.clamp(this._theta + -yh * 5, -Math.PI / 3, Math.PI / 3);

        const qx = new THREE.Quaternion();
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._phi);
        const qz = new THREE.Quaternion();
        qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this._theta);

        const q = new THREE.Quaternion();
        q.multiply(qx);
        q.multiply(qz);
        this._rotation.copy(q);
    }
}

export default class Player extends ThridPersonCamera {
    /**
     *
     * @param {World} world
     * @param canvas
     */
    constructor(world, canvas) {
        let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        super(camera);
        this.width = 0.2;
        this.gravity = -4;
        this.onGround = false;
        this.world = world;
        this.movement_speed = 0.7;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.vertical_momentum = 0;
        this.jump_force = 1;
        this.canvas = canvas;
        // this.movement_worker = new MovementWorker();
        this.lock_mouse();
    }

    /**
     * locks the mouse to the canvas
     */
    lock_mouse() {
        addEventListener("click", e => {
            this.canvas.requestPointerLock({
                unadjustedMovement: true,
            });
        })
    }

    calculate_velocity(deltaTime) {
        let fowardVel = (this._controller.keyPressed('w') ? 1 : 0 + this._controller.keyPressed('s') ? -1 : 0);
        let strafeVel = (this._controller.keyPressed('a') ? 1 : 0 + this._controller.keyPressed('d') ? -1 : 0);

        if(this.onGround) {
            this.vertical_momentum = this._controller.keyPressed(" ") ? this.jump_force : 0;
            this.onGround = false;
        }

        if(this.vertical_momentum > this.gravity)
            this.vertical_momentum += deltaTime * this.gravity;

        if(this.position.y-Math.floor(this.position.y) < 0.05) {
            this.position.y = Math.floor(this.position.y);
        }

        this.velocity = this._getTranslation(fowardVel, this.vertical_momentum, strafeVel, deltaTime);
        this.velocity.x *= this.movement_speed;
        this.velocity.z *= this.movement_speed;
    }

    /**
     * moves the player and checks if the player isn't moving into any blocks
     * @param deltaTime
     */
    update_player_movement(deltaTime) {
        this.calculate_velocity(deltaTime);

        // check if the player isn't moving through a block on the north or south axis
        if((this.velocity.x > 0 && this.block_right()) || (this.velocity.x < 0 && this.block_left()))
            this.velocity.x = 0;
        // check if the player isn't moving through a block on the east or west axis.
        if((this.velocity.z > 0 && this.block_front()) || (this.velocity.z < 0 && this.block_back()))
            this.velocity.z = 0;

        if(this.velocity.y < 0)
            this.velocity.y = this.checkDownSpeed();
        else if(this.velocity.y > 0)
            this.velocity.y = this.checkUpSpeed()

        // the player position
        this._updateTranslation(this.velocity, deltaTime);

        // update the rotation and set the position of the camera to the new updated poisition;
        this.update();
    }

    //***********************************************//
    // THE UPCOMING 6 functions are box colliders!   //
    //***********************************************//

    /**
     * checks if there is a block beneath the player, this does take the width of the player into account!
     * @returns {*|number}
     */
    checkDownSpeed() {
        if(this.world.CheckVoxel(this.position.x-this.width, this.position.y-2+this.velocity.y, this.position.z-this.width)) {
            this.onGround = true;
            return 0;
        }
        if(this.world.CheckVoxel(this.position.x+this.width, this.position.y-2+this.velocity.y, this.position.z-this.width)) {
            this.onGround = true;
            return 0;
        }
        if(this.world.CheckVoxel(this.position.x-this.width, this.position.y-2+this.velocity.y, this.position.z+this.width)) {
            this.onGround = true;
            return 0;
        }
        if(this.world.CheckVoxel(this.position.x+this.width, this.position.y-2+this.velocity.y, this.position.z+this.width)) {
            this.onGround = true;
            return 0;
        }

        this.onGround = false;
        return this.velocity.y;
    }

    /**
     * checks if there is a block above the player and returns the velocity the player should be going at
     * (the same if there is no block else 0)
     * @returns {number}
     */
    checkUpSpeed() {
        if(this.world.CheckVoxel(this.position.x-this.width, this.position.y+this.velocity.y, this.position.z-this.width)) {
            return 0;
        }
        if(this.world.CheckVoxel(this.position.x+this.width, this.position.y+this.velocity.y, this.position.z-this.width)) {
            return 0;
        }
        if(this.world.CheckVoxel(this.position.x-this.width, this.position.y+this.velocity.y, this.position.z+this.width)) {
            return 0;
        }
        if(this.world.CheckVoxel(this.position.x+this.width, this.position.y+this.velocity.y, this.position.z+this.width)) {
            return 0;
        }

        return this.velocity.y;
    }

    /**
     * checks if there is a block in front of the player(+z)
     * NOTE: this 'front' is not always in front of the player since if the player turns this would not be the front
     * anymore
     * @returns {boolean}
     */
    block_front() {
        return this.world.CheckVoxel(this.position.x, this.position.y-1, this.position.z+this.width+this.velocity.z) ||
               this.world.CheckVoxel(this.position.x, this.position.y-2, this.position.z+this.width+this.velocity.z) ||
               this.world.CheckVoxel(this.position.x+this.width, this.position.y-1, this.position.z+this.width+this.velocity.z) ||
               this.world.CheckVoxel(this.position.x+this.width, this.position.y-2, this.position.z+this.width+this.velocity.z) ||
               this.world.CheckVoxel(this.position.x-this.width, this.position.y-1, this.position.z+this.width+this.velocity.z) ||
               this.world.CheckVoxel(this.position.x-this.width, this.position.y-2, this.position.z+this.width+this.velocity.z);
    }

    /**
     * checks if there is a block in front of the player(-z)
     * NOTE: this 'back' is not always the back of the player since if the player turns this would not be the back
     * anymore
     * @returns {boolean}
     */
    block_back() {
        return this.world.CheckVoxel(this.position.x, this.position.y-1, this.position.z-this.width+this.velocity.z) ||
               this.world.CheckVoxel(this.position.x, this.position.y-2, this.position.z-this.width+this.velocity.z) ||
               this.world.CheckVoxel(this.position.x+this.width, this.position.y-1, this.position.z-this.width+this.velocity.z) ||
               this.world.CheckVoxel(this.position.x+this.width, this.position.y-2, this.position.z-this.width+this.velocity.z) ||
               this.world.CheckVoxel(this.position.x-this.width, this.position.y-1, this.position.z-this.width+this.velocity.z) ||
               this.world.CheckVoxel(this.position.x-this.width, this.position.y-2, this.position.z-this.width+this.velocity.z);
    }

    /**
     * checks if there is a block in front of the player(-x)
     * NOTE: this 'left' is not always in left of the player since if the player turns this would not be the left
     * anymore
     * @returns {boolean}
     */
    block_left() {
        return this.world.CheckVoxel(this.position.x-this.width+this.velocity.x, this.position.y-1, this.position.z) ||
               this.world.CheckVoxel(this.position.x-this.width+this.velocity.x, this.position.y-2, this.position.z) ||
               this.world.CheckVoxel(this.position.x-this.width+this.velocity.x, this.position.y-1, this.position.z+this.width) ||
               this.world.CheckVoxel(this.position.x-this.width+this.velocity.x, this.position.y-2, this.position.z+this.width) ||
               this.world.CheckVoxel(this.position.x-this.width+this.velocity.x, this.position.y-1, this.position.z-this.width) ||
               this.world.CheckVoxel(this.position.x-this.width+this.velocity.x, this.position.y-2, this.position.z-this.width);
    }

    /**
     * checks if there is a block in front of the player(+x)
     * NOTE: this 'right' is not always in right of the player since if the player turns this would not be the right
     * anymore
     * @returns {boolean}
     */
    block_right() {
        return this.world.CheckVoxel(this.position.x+this.width+this.velocity.x, this.position.y-1, this.position.z) ||
               this.world.CheckVoxel(this.position.x+this.width+this.velocity.x, this.position.y-2, this.position.z) ||
               this.world.CheckVoxel(this.position.x+this.width+this.velocity.x, this.position.y-1, this.position.z+this.width) ||
               this.world.CheckVoxel(this.position.x+this.width+this.velocity.x, this.position.y-2, this.position.z+this.width) ||
               this.world.CheckVoxel(this.position.x+this.width+this.velocity.x, this.position.y-1, this.position.z-this.width) ||
               this.world.CheckVoxel(this.position.x+this.width+this.velocity.x, this.position.y-2, this.position.z-this.width);
    }
}
