class MapData {
    /**
     * Map Data Constructor
     * @param {Object} param0 Configuration object containing the following...
     * @param {Array2D<BlockChunkData>} param0.blockChunks A 2D Multi-Dimensional Array containing BlockChunkData
     * @param {String} param0.perlinSeed The Perlin Seed for this Map
     * @param {Number} param0.borderZ The Z Coordinate of the Border
     */
    constructor({blockChunks, perlinSeed, borderZ}) {
      this.blockChunks = blockChunks;
      this.perlinSeed = perlinSeed;
      this.borderZ = borderZ;
    }
  
    update() {}
  }
  
  module.exports = MapData;
  