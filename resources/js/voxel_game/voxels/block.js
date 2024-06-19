export default class BlockType {
    /**
     * 
     * @param {string} block_type name of the block
     * @param {boolean} is_solid texture will need to be transparent if not solid(or air)
     * @param textureIds needs to have 6 texture ids, texture id order is [back, front, top, bottom, left, right!]
     */
    constructor(block_type, is_solid, textureIds) {
        this.block_type = block_type;
        this.is_solid = is_solid
        this.textureIds = textureIds;
    }

    getTextureID(faceIndex) {
        return this.textureIds[faceIndex];
    }
}