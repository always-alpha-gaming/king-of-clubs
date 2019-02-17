class MapData {
  /**
   * Map Data Constructor
   * @param {Object} param0 Configuration object containing the following...
   * @param {Array2D<BlockChunkData>} param0.blockChunks A 2D Multi-Dimensional Array containing BlockChunkData
   * @param {String} param0.perlinSeed The Perlin Seed for this Map
   * @param {Number} param0.borderZ The Z Coordinate of the Border
   */
  constructor({ blockChunks = [], perlinSeed = 'seed', borderZ = 0 }) {
    this.blockChunks = blockChunks;
    this.perlinSeed = perlinSeed;
    this.borderZ = borderZ;
  }

  addChunk(chunk) {
    console.log(chunk);
    const [x, z] = chunk.position;
    if (!Array.isArray(this.blockChunks[x])) {
      this.blockChunks[x] = [];
    }

    this.blockChunks[x][z] = chunk;
  }

  forEachChunk(fn) {
    this.blockChunks.forEach(
      x => x.forEach(
        chunk => fn(chunk),
      ),
    );
  }

  update() {
  }
}

module.exports = MapData;
