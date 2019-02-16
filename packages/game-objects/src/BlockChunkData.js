class BlockChunkData {
    /**
     * Block Chunk Data Constructor
     * @param {Object} param0 Configuration object containing the following...
     * @param {String} param0.id The Globally Unique ID of the Chunk
     * @param {Array3D<BlockChunkData>} param0.blocks The Blocks within the Chunk within a 3D Multi-Dimensional Array
     * @param {Vector3} param0.position The Absolute Postion of the chunk 
     */
    constructor({id, blocks, position}) {
        this.id = id;
        this.blocks = blocks;
        this.position = position;
    }
  
    update() {}
  }
  
  module.exports = BlockChunkData;
  