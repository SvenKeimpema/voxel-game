import * as THREE from 'three';
import InputController from './controller';
import VoxelData from '../voxels/data.js'

export default class ThridPersonCamera {
    constructor(camera) {
        this._camera = camera;
        this._controller = new InputController();
        this._rotation = new THREE.Quaternion();
        this._translation = new THREE.Vector3((VoxelData.worldSizeInChunks*VoxelData.chunkWidth)/2, VoxelData.chunkHeight+2, (VoxelData.worldSizeInChunks*VoxelData.chunkWidth)/2);
        this._phi = 0;
        this._theta = 0;
    }

    update(deltaTime) {
        this._updateRotation();
        this._updateTranslation(deltaTime);
        this._updateCamera();
        this._controller.update();
    }

    _updateCamera() {
        this._camera.quaternion.copy(this._rotation);
        this._camera.position.copy(this._translation);
    }

    _updateTranslation(timeElapsed) {
        const fowardVel = (this._controller.keyPressed('w') ? 1 : 0 + this._controller.keyPressed('s') ? -1 : 0);
        const strafeVel = (this._controller.keyPressed('a') ? 1 : 0 + this._controller.keyPressed('d') ? -1 : 0);
        const upVel = (this._controller.keyPressed(' ') ? -1 : 0 + this._controller.keyPressed('shift') ? 1 : 0);

        const qx = new THREE.Quaternion();
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._phi);

        const foward = new THREE.Vector3(0, 0, -1);
        foward.applyQuaternion(qx);
        foward.multiplyScalar(fowardVel * timeElapsed * 10);

        const strafe = new THREE.Vector3(-1, 0, 0);
        strafe.applyQuaternion(qx);
        strafe.multiplyScalar(strafeVel * timeElapsed * 10);

        const up = new THREE.Vector3(0, -1, 0);
        up.applyQuaternion(qx);
        up.multiplyScalar(upVel * timeElapsed * 10);

        this._translation.add(foward);
        this._translation.add(strafe);
        this._translation.add(up);
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