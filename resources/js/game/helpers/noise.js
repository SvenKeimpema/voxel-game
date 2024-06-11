import {Vector2, Vector3} from "three";
import VoxelData from "../voxels/data";

class XORShift {
    constructor(seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) {
        // Initialize state variables
        this.seed = seed;
    }

    random() {
        let x = Math.sin(this.seed++) * 10000;
        return Math.round(x - Math.floor(x));
    }
}

/**
 * FOUND ON THE INTERNET, I DID NOT MAKE THIS!
 */
class PerlinNoise {
    constructor(seed) {
        this.random_math = new XORShift(seed);
        this.perlin_size = 8191;
        this.perlin = new Array(this.perlin_size+1);
        this.perlin_octaves = this.perlin_ywarb = 4;
        this.perlin_ywrap = 1 << this.perlin_ywarb;
        this.perlin_zwrapb = 8;
        this.perlin_zwrap = 1 << this.perlin_zwrapb;
        this.perlin_amp_falloff = 0.5; // 50% octave reduction

        for(let i = 0; i < this.perlin_size+1; i++) {
            this.perlin[i] = this.random_math.random();
        }

    }
    
    // scales the cosine down to a number between 0-1
    scaled_cosine(i) {
        return 0.5 * (1.0 - Math.cos(i * Math.PI));
    }

    /**
     * WORKS FROM 1D space to 3D space
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {number}
     */
    noise(x, y = 0, z = 0) {
        let xi = Math.floor(x),
        yi = Math.floor(y),
        zi = Math.floor(z);
        let xf = x - xi;
        let yf = y - yi;
        let zf = z - zi;
        let rxf, ryf;

        let r = 0;
        let ampl = 0.5;

        let n1, n2, n3;

        for (let o = 0; o < this.perlin_octaves; o++) {
            let of = xi + (yi << this.perlin_ywarb) + (zi << this.perlin_zwrapb);

            rxf = this.scaled_cosine(xf);
            ryf = this.scaled_cosine(yf);

            n1 = this.perlin[of & this.perlin_size];
            n1 += rxf * (this.perlin[(of + 1) & this.perlin_size] - n1);
            n2 = this.perlin[(of + this.perlin_ywrap) & this.perlin_size];
            n2 += rxf * (this.perlin[(of + this.perlin_ywrap + 1) & this.perlin_size] - n2);
            n1 += ryf * (n2 - n1);

            of += this.perlin_zwrap;
            n2 = this.perlin[of & this.perlin_size];
            n2 += rxf * (this.perlin[(of + 1) & this.perlin_size] - n2);
            n3 = this.perlin[(of + this.perlin_ywrap) & this.perlin_size];
            n3 += rxf * (this.perlin[(of + this.perlin_ywrap + 1) & this.perlin_size] - n3);
            n2 += ryf * (n3 - n2);

            n1 += this.scaled_cosine(zf) * (n2 - n1);

            r += n1 * ampl;
            ampl *= this.perlin_amp_falloff;
            xi <<= 1;
            xf *= 2;
            yi <<= 1;
            yf *= 2;
            zi <<= 1;
            zf *= 2;

            if (xf >= 1.0) {
              xi++;
              xf--;
            }
            if (yf >= 1.0) {
              yi++;
              yf--;
            }
            if (zf >= 1.0) {
              zi++;
              zf--;
            }
        }
        return r;
    }
}



export default class Noise {
    constructor(seed) {
        this.noise_gen = new PerlinNoise(seed);
    }

    /**
     * 
     * @param {Vector2} position 
     * @param {number} offset 
     * @param {number} scale 
     * @returns {number}
     */
    get2DPerlinNoise(position, offset, scale) {
        return this.noise_gen.noise(
            (position.x) / VoxelData.chunkWidth * scale + offset,
            (position.y) / VoxelData.chunkWidth * scale + offset,
        );
        // return 0;
    }

    /**
     * Returns a number between 0-1 based on noise, this is better then using something like random
     * numbers for height and biomes.
     * 
     * @param {Vector3} position 
     * @param {number} offset 
     * @param {number} scale 
     * @param {number} threshold 
     */
    get3DPerlinNoise(position, offset, scale, threshold) {
        let noiseVal = this.noise_gen.noise(
            (position.x) / VoxelData.chunkWidth * scale + offset,
            (position.y) / VoxelData.chunkHeight * scale + offset,
            (position.z) / VoxelData.chunkWidth * scale + offset,
        );

        return noiseVal / 6 > threshold;
    }
}