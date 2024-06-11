import * as THREE from 'three';
import InputController from '../helpers/controller.js';
import VoxelData from '../voxels/data.js'
import World from '../voxels/world.js';

class ThridPersonCamera {
    constructor(camera) {
        this._camera = camera;
        this._controller = new InputController();
        this._rotation = new THREE.Quaternion();
        this._translation = new THREE.Vector3((VoxelData.worldSizeInChunks*VoxelData.chunkWidth)/2, VoxelData.chunkHeight+2, (VoxelData.worldSizeInChunks*VoxelData.chunkWidth)/2);
        this._phi = 0;
        this._theta = 0;
    }

    update() {
        this._updateRotation();
        this._updateCamera();
        this._controller.update();
    }

    _updateCamera() {
        this._camera.quaternion.copy(this._rotation);
        this._camera.position.copy(this._translation);
    }

    _updateTranslation(velocity) {
        this._translation.add(velocity);
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
     * @param {THREE.PerspectiveCamera} camera 
     */
    constructor(world, camera) {
        super(camera);

        this.width = 0.2;
        this.gravity = -4;
        this.onGround = false;
        this.world = world;
        this.movement_speed = 0.7;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.vertical_momentum = 0;
        this.jump_force = 1;
        this.velocity = 0;
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

        if(this._translation.y-Math.floor(this._translation.y) < 0.05) {
            this._translation.y = Math.floor(this._translation.y);
        }

        this.velocity = this._getTranslation(fowardVel, this.vertical_momentum, strafeVel, deltaTime);
    }

    update_player_movement(deltaTime) {
        this.calculate_velocity(deltaTime);

        if(this.velocity.y < 0) 
            this.velocity.y = this.checkDownSpeed(this.velocity.y);
        else if(this.velocity.y > 0)
            this.velocity.y = this.checkUpSpeed(this.velocity.y)

        if((this.velocity.x > 0 && this.block_right()) || (this.velocity.x < 0 && this.block_left()))
            this.velocity.x = 0;
        if((this.velocity.z > 0 && this.block_front()) || (this.velocity.z < 0 && this.block_back()))
            this.velocity.z = 0;
        
        this.velocity.x *= this.movement_speed;
        this.velocity.z *= this.movement_speed;

        // the player position
        this._updateTranslation(this.velocity, deltaTime);

        // update the rotation and set the position of the camera to the new updated poisition;
        this.update();
    }

    checkDownSpeed(downSpeed) {
        let xPos = Math.round(this._translation.x*10)/10;
        let zPos = Math.round(this._translation.z*10)/10;

        if(this.world.CheckVoxel(xPos-this.width, this._translation.y-2+downSpeed, zPos-this.width)) {
            this.onGround = true;
            return 0;
        }
        if(this.world.CheckVoxel(this._translation.x+this.width, this._translation.y-2+downSpeed, zPos-this.width)) {
            this.onGround = true;
            return 0;
        }
        if(this.world.CheckVoxel(xPos-this.width, this._translation.y-2+downSpeed, this._translation.z+this.width)) {
            this.onGround = true;
            return 0;
        }
        if(this.world.CheckVoxel(this._translation.x+this.width, this._translation.y-2+downSpeed, this._translation.z+this.width)) {
            this.onGround = true;
            return 0;
        }

        this.onGround = false;
        return downSpeed;
    }

    checkUpSpeed(upSpeed) {
        if(this.world.CheckVoxel(this._translation.x-this.width, this._translation.y+upSpeed, this._translation.z-this.width)) {
            return 0;
        }
        if(this.world.CheckVoxel(this._translation.x+this.width, this._translation.y+upSpeed, this._translation.z-this.width)) {
            return 0;
        }
        if(this.world.CheckVoxel(this._translation.x-this.width, this._translation.y+upSpeed, this._translation.z+this.width)) {
            return 0;
        }
        if(this.world.CheckVoxel(this._translation.x+this.width, this._translation.y+upSpeed, this._translation.z+this.width)) {
            return 0;
        }

        return upSpeed;
    }



    block_front() {
        return this.world.CheckVoxel(this._translation.x, this._translation.y-1, this._translation.z+this.width+this.velocity.z) || 
               this.world.CheckVoxel(this._translation.x, this._translation.y-2, this._translation.z+this.width+this.velocity.z);
    }

    block_back() {
        return this.world.CheckVoxel(this._translation.x, this._translation.y-1, this._translation.z-this.width) || 
               this.world.CheckVoxel(this._translation.x, this._translation.y-2, this._translation.z-this.width);
    }
    
    block_left() {
        return this.world.CheckVoxel(this._translation.x-this.width, this._translation.y-1, this._translation.z) || 
               this.world.CheckVoxel(this._translation.x-this.width, this._translation.y-2, this._translation.z);
    }

    block_right() {
        return this.world.CheckVoxel(this._translation.x+this.width+this.velocity.x, this._translation.y-1, this._translation.z) || 
               this.world.CheckVoxel(this._translation.x+this.width+this.velocity.x, this._translation.y-2, this._translation.z);
    }
}