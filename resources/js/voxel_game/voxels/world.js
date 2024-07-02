import { Vector3, Vector2 } from 'three';
import * as THREE from 'three';
import BlockType from './block';
import Chunk from './chunk';
import VoxelData from './data';
import MathUtils from '../helpers/math.js';
import Noise from '../helpers/noise.js';
import { DefaultBiome } from './biome';
import axios from "axios";

export default class World {
    static blocktypes = [
        new BlockType('air', false, [
            1,0,2,
            0,2,0
        ]),
        new BlockType('Bedrock', true, [
            9,9,9,
            9,9,9
        ]),
        new BlockType('Stone', true, [
            0,0,0,
            0,0,0
        ]),
        new BlockType('GrassBlock', true, [
            2,2,7,
            1,2,2
        ]),
        new BlockType('Dirt', true, [
            1,1,1,
            1,1,1
        ])
    ];


    constructor(scene) {
        // used for adding and removing meshes from the game
        this.scene = scene;

        // both hashmaps store the chunk data by x*worldSizeInChunks+z!
        this.chunks = {};
        this.chunkUUID = {};

        this.biome = new DefaultBiome();
        this.seed = this.get_seed();
        this.seed = this.seed.next().value;
        console.log(this.seed);
        this.noise = new Noise(this.seed);

    }

    *get_seed() {
        return yield axios.post('/get_seed');
    }

    CheckVoxel(x, y, z) {
        if(!this.IsBlockInWorld(x, z))
            return false;
        if(y < 0) {
            return true;
        }

        // create a int out of the player position;
        let xPos = Math.floor(x);
        let yPos = Math.floor(y);
        let zPos = Math.floor(z);

        // get the chunk the player is standing on in x, z
        let xChunk = Math.floor(xPos / VoxelData.chunkWidth);
        let zChunk = Math.floor(zPos / VoxelData.chunkWidth);

        // calculate the exact block the player is on in the chunk
        xPos -= (xChunk * VoxelData.chunkWidth);
        zPos -= (zChunk * VoxelData.chunkWidth);

        if(yPos >= VoxelData.chunkHeight)
            return false;
        try {
            return World.blocktypes[this.chunks[(xChunk*VoxelData.worldSizeInChunks)+zChunk].blockMap[xPos][yPos][zPos]].is_solid;
        }catch (e) {
            console.log("[ERROR] failed to get block");
            console.log("chunk_pos: ", (xChunk*VoxelData.worldSizeInChunks)+zChunk);
            console.log("block_pos: ", [xPos, yPos, zPos]);
            console.log("chunks: ", this.chunks);
            console.log("blocks: ", this.chunks[(xChunk*VoxelData.worldSizeInChunks)+zChunk].blockMap)
        }
    }

    /**
     *
     * @param {THREE.Vector3} pos
     */
    GetVoxel(pos) {
        let yFloor = Math.floor(pos.y);

        if(yFloor === 0)
            return 1;

        let terrainHeight = Math.floor(this.noise.get2DPerlinNoise(new THREE.Vector2(pos.x, pos.z), 500, this.biome.scale) * this.biome.max_height);
        terrainHeight = Math.max(terrainHeight, this.biome.min_height);
        let voxelValue = 0;

        if(yFloor === terrainHeight)
            voxelValue = 3;
        else if(yFloor < terrainHeight && yFloor > terrainHeight - 4)
            voxelValue = 4;
        else if(yFloor > terrainHeight)
            return 0;
        else
            voxelValue = 2;

        if (voxelValue === 1) {
            this.biome.layers.forEach((layer) => {
                if(yFloor > layer.min_height && yFloor < layer.max_height)
                    if(this.noise.get3DPerlinNoise(pos, layer.offset, layer.scale, layer.threshold))
                        voxelValue = layer.block_id;
            })
        }

        return voxelValue
    }

    getChunk(x, z) {
        let loc = x*VoxelData.worldSizeInChunks+z;

        if(!(loc in this.chunks))
            return null;

        return this.chunks[loc];
    }

    IsBlockInWorld(x, z) {
        return x > 0 && x < VoxelData.worldSizeInBlocks-1 && z > 0 && z < VoxelData.worldSizeInBlocks-1;
    }

    IsChunkInWorld(x, z) {
        return x > 0 && x < VoxelData.worldSizeInChunks-1 && z > 0 && z < VoxelData.worldSizeInChunks-1;
    }

    checkViewDistance(plr_location) {
        let plr_chunk_coord = MathUtils.GetChunkCoordFromVector3(plr_location);


        let previouslyActiveChunks = {...this.chunks};

        for(let x = plr_chunk_coord.x - VoxelData.viewDistanceInChunks; x < plr_chunk_coord.x + VoxelData.viewDistanceInChunks; x++) {
            for(let z = plr_chunk_coord.z - VoxelData.viewDistanceInChunks; z < plr_chunk_coord.z + VoxelData.viewDistanceInChunks; z++) {
                if(this.IsChunkInWorld(x, z)) {
                    if(this.getChunk(x, z) == null) {
                        this._createChunk(x, z);
                    }

                    delete previouslyActiveChunks[x*VoxelData.worldSizeInChunks+z];
                }
            }
        }

        for(const [key, value] of Object.entries(previouslyActiveChunks)) {
            this.removeChunk(Number(key));
        }
    }

    generateWorld() {
        for(let x = (VoxelData.worldSizeInChunks / 2) - VoxelData.viewDistanceInChunks; x < (VoxelData.worldSizeInChunks / 2) + VoxelData.viewDistanceInChunks; x++) {
            for(let z = (VoxelData.worldSizeInChunks / 2) - VoxelData.viewDistanceInChunks; z < (VoxelData.worldSizeInChunks / 2) + VoxelData.viewDistanceInChunks; z++) {
                if(this.IsChunkInWorld(x, z)) {
                    this._createChunk(x, z);
                }
            }
        }
    }

    _createChunk(x, z) {
        let chunk = new Chunk(this, new Vector3(x, 0, z));
        this.chunks[x*VoxelData.worldSizeInChunks+z] = chunk;
        let mesh = chunk.createMeshFromVoxelData();
        this.chunkUUID[x*VoxelData.worldSizeInChunks+z] = mesh.uuid;
        this.scene.add(mesh);
    }

    /**
     * removes a chunk mesh from the scene, reason: storing chunks costs A LOT of ram
     * @param {number} coord
     */
    removeChunk(coord) {
        let mesh = this.scene.getObjectByProperty("uuid", this.chunkUUID[coord]);

        mesh.geometry.dispose();
        mesh.material.dispose();
        this.scene.remove(mesh);

        delete this.chunks[coord];
        delete this.chunkUUID[coord];
    }
}
