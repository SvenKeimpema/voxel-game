import * as THREE from 'three'

export default class VoxelData {
    // min: viewDistanceInChunks*2
    static worldSizeInChunks = 8;
    static chunkWidth = 16;
    static chunkHeight = 128;
    static worldSizeInBlocks = this.worldSizeInChunks * this.chunkWidth;
    static viewDistanceInChunks = 8;

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

        this.uvs = [
            0, 0,
            0, 1,
            1, 0,
            1, 1
        ];
    }

    NormalizedBlockTextureSize() {
        return 1.0 / this.TextureAtlasSizeRowColBlocks;
    }

    getVertices() {
        return this.vertices;
    }

    getTriangles() {
        return this.triangles;
    }

    getUvs() {
        return this.uvs;
    }
}