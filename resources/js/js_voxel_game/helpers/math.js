import * as THREE from 'three'
import VoxelData from '../voxels/data';

export default class MathUtils {
    /**
     * 
     * @param {THREE.vector2} vector1 
     * @param {Number} comp 
     * @returns 
     */
    static multiplyVector2Scalar(vector1, comp) {
        return vector1.clone().multiplyScalar(comp);
    }

    /**
     * 
     * @param {THREE.vector3} vector1 
     * @param {Number} comp 
     * @returns 
     */
    static multiplyVector3Scalar(vector1, comp) {
        return vector1.clone().multiplyScalar(comp);
    }

    /**
     * 
     * @param {THREE.vector2} vector1 
     * @param {THREE.vector2} vector2 
     * @returns 
     */
    static addVector2(vector1, vector2) {
        return new THREE.Vector2().addVectors(vector1, vector2);
    }

    /**
     * 
     * @param {THREE.vector3} vector1 
     * @param {THREE.vector3} vector2 
     * @returns 
     */
    static addVector3(vector1, vector2) {
        return new THREE.Vector3().addVectors(vector1, vector2);
    }

    /**
     * 
     * @param {THREE.vector3} pos 
     * @returns 
     */
    static GetChunkCoordFromVector3(pos) {
        let x = Math.floor(pos.x / VoxelData.chunkWidth);
        let z = Math.floor(pos.z / VoxelData.chunkWidth);

        return new THREE.Vector3(x, pos.y, z);
    }
}