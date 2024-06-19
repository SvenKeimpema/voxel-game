class Layer {
    constructor(block_name, block_id, min_height, max_height, scale, threshold, offset) {
        this.block_name = block_name;
        this.block_id = block_id;
        this.min_height = min_height;
        this.max_height = max_height;
        this.threshold = threshold;
        this.offset = offset;
        this.scale = scale;
    }
}

class BiomeInfo {
    constructor(name, min_height, max_height, scale, layers) {
        this.name =name;
        this.min_height = min_height;
        this.max_height = max_height;
        this.scale = scale;
        this.layers = layers;
    }
}

export class DefaultBiome extends BiomeInfo {
    constructor() {
        super("default", 42, 80, 0.25, [
            // min_height doesn't matter!
            new Layer("Dirt", 4, 1, 255, 0.1, 0.5, 0),
            new Layer("Sand", 4, 30, 60, 0.2, 0.6, 500),
        ])
    }
}