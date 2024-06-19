import * as THREE from 'three';
import VoxelData from './data';
import MathUtils from '../helpers/math';
import textureAtlas from '../textures/Blocks.png'
import World from './world';

export default class Chunk {

    /**
     *
     * @param {THREE.Vector3} coord coordinate of where the chunk should be placed
     */
    constructor(world, coord) {
        this.world = world;
        this.coord = coord;
        this.position = new THREE.Vector3(coord.x * VoxelData.chunkWidth, 0, coord.z * VoxelData.chunkWidth);
        this.vertexIndex = 0;
        this.vertices = [];
        this.triangles = [];
        this.uvs = [];
        this.voxelData = new VoxelData();
        this.blockMap = this._populateBlockMap();
        this._CreateChunkData();
    }

    createArray(dimensions) {
        var arr = [];
        for(var i=0; i<dimensions[0]; i++) {
            arr.push(this.createArray(dimensions.slice(1)));
        }
        return arr;
    }

    createMeshFromVoxelData() {
        const geometry = new THREE.BufferGeometry();
        const texture = new THREE.TextureLoader().load(textureAtlas);
        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        geometry.setIndex(this.triangles);
        geometry.setAttribute('position', new THREE.BufferAttribute( new Float32Array(this.vertices), 3 ) );
        geometry.setAttribute('uv', new THREE.BufferAttribute( new Float32Array(this.uvs), 2 ) );
        geometry.computeVertexNormals();
        const material = new THREE.MeshBasicMaterial({map: texture});

        return new THREE.Mesh( geometry, material );
    }

    _populateBlockMap() {
        let map = this.createArray([VoxelData.chunkWidth, VoxelData.chunkHeight, VoxelData.chunkWidth]);

        for(let y = 0; y < VoxelData.chunkHeight; y++) {
            for(let x = 0; x < VoxelData.chunkWidth; x++) {
                for(let z = 0; z < VoxelData.chunkWidth; z++) {
                    let xCoord = this.position.x + x;
                    let zCoord = this.position.z + z;

                    map[x][y][z] = this.world.GetVoxel(new THREE.Vector3(xCoord, y, zCoord));
                }
            }
        }

        return map;
    }


    _invalidVoxel(pos) {
        let x = Math.floor(pos.x);
        let y = Math.floor(pos.y);
        let z = Math.floor(pos.z);

        if(!this._VoxelInChunk(x, y, z)) {
            return World.blocktypes[this.world.GetVoxel(MathUtils.addVector3(this.position, pos))].is_solid;
        }

        return World.blocktypes[this.blockMap[x][y][z]].is_solid;
    }


    _VoxelInChunk(x, y, z) {
        if(x < 0 || x > VoxelData.chunkWidth - 1 || y < 0 || y > VoxelData.chunkHeight - 1 || z < 0 || z > VoxelData.chunkWidth - 1)
            return false;
        return true;
    }

    _CreateChunkData() {
        for(let y = 0; y < VoxelData.chunkHeight; y++) {
            for(let x = 0; x < VoxelData.chunkWidth; x++) {
                for(let z = 0; z < VoxelData.chunkWidth; z++) {
                    if (World.blocktypes[this.blockMap[x][y][z]].is_solid)
                        this._createVoxel(new THREE.Vector3(x, y, z));
                }
            }
        }
    }

    _addVertex(triangleIndex, pos) {
        this.vertices.push(this.voxelData.vertices[triangleIndex*3] + pos.x + (this.coord.x * VoxelData.chunkWidth));
        this.vertices.push(this.voxelData.vertices[triangleIndex*3+1] + pos.y);
        this.vertices.push(this.voxelData.vertices[triangleIndex*3+2] + pos.z + (this.coord.z * VoxelData.chunkWidth));
    }

    _addUvTexture(xNormTexture, yNormTexture) {
        this.uvs.push(xNormTexture);
        this.uvs.push(yNormTexture);
    }

    _createVoxel(pos) {
        const voxelData = new VoxelData();

        for(let p = 0; p < 6; p++) {
            if(this._invalidVoxel(MathUtils.addVector3(pos, this.voxelData.faceChecks[p]))) continue;

            let voxelTriangles = voxelData.getTriangles();

            let block_id = this.blockMap[pos.x][pos.y][pos.z];

            this._addVertex(voxelTriangles[p][0], pos);
            this._addVertex(voxelTriangles[p][1], pos);
            this._addVertex(voxelTriangles[p][2], pos);
            this._addVertex(voxelTriangles[p][3], pos);

            this._addTexture(World.blocktypes[block_id].getTextureID(p));

            this.triangles.push(this.vertexIndex);
            this.triangles.push(this.vertexIndex+1);
            this.triangles.push(this.vertexIndex+2);
            this.triangles.push(this.vertexIndex+2);
            this.triangles.push(this.vertexIndex+1);
            this.triangles.push(this.vertexIndex+3);

            this.vertexIndex += 4;

        }
    }

    _addTexture(textureID) {
        let x = textureID % this.voxelData.TextureAtlasSizeRowColBlocks;
        let y = Math.floor(textureID / this.voxelData.TextureAtlasSizeRowColBlocks);

        let normSize = this.voxelData.NormalizedBlockTextureSize();
        let xNorm = x * normSize;
        let yNorm = (y * normSize);
        yNorm = 1 - yNorm - normSize;

        this._addUvTexture(xNorm, yNorm);
        this._addUvTexture(xNorm, yNorm + normSize);
        this._addUvTexture(xNorm + normSize, yNorm);
        this._addUvTexture(xNorm + normSize, yNorm + normSize);
    }
}
