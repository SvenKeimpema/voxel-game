import * as THREE from 'three'

export default class VoxelData {
    // min: viewDistanceInChunks*2
    static worldSizeInChunks = 40;
    static chunkWidth = 8;
    static chunkHeight = 128;
    static worldSizeInBlocks = this.worldSizeInChunks * this.chunkWidth;
    static viewDistanceInChunks = 4;

    constructor() {
        this.TextureAtlasSizeRowColBlocks = 4;

        this.vertices = new Float32Array([
            0.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0,
            1.0, 0.0, 1.0,
            1.0, 1.0, 1.0,
            0.0, 1.0, 1.0,
        ]);

        this.faceChecks = [
            new THREE.Vector3( 0,  0, -1),
            new THREE.Vector3( 0,  0,  1),
            new THREE.Vector3( 0,  1,  0),
            new THREE.Vector3( 0, -1,  0),
            new THREE.Vector3(-1,  0,  0),
            new THREE.Vector3( 1,  0,  0),
        ];

        this.triangles = [
            [0, 3, 1, 2], // back
            [5, 6, 4, 7], // front
            [3, 7, 2, 6], // top
            [1, 5, 0, 4], // bottom
            [4, 7, 0, 3], // left
            [1, 2, 5, 6], // right
        ];
    }

    NormalizedBlockTextureSize() {
        return 1.0 / this.TextureAtlasSizeRowColBlocks;
    }

    getTriangles() {
        return this.triangles;
    }
}
