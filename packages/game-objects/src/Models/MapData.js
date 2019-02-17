const CONFIG = require('config');

class MapData {
  /**
   * Map Data Constructor
   * @param {Object} param0 Configuration object containing the following...
   * @param {Array2D<BlockChunkData>} param0.blockChunks A 2D Multi-Dimensional Array containing BlockChunkData
   * @param {String} param0.perlinSeed The Perlin Seed for this Map
   * @param {Number} param0.borderZ The Z Coordinate of the Border
   */
  constructor({ blockChunks = {}, perlinSeed = 'seed', borderZ = 0 }) {
    this.blockChunks = blockChunks;
    this.perlinSeed = perlinSeed;
    this.borderZ = borderZ;
  }

  addChunk(chunk) {
    const [x, z] = chunk.position;
    if (!Object.prototype.hasOwnProperty.call(this.blockChunks, x)) {
      this.blockChunks[x] = {};
    }

    this.blockChunks[x][z] = chunk;
  }

  forEachChunk(fn) {
    Object.values(this.blockChunks).forEach(
      x => Object.values(x).forEach(
        chunk => fn(chunk),
      ),
    );
  }

  static getChunkCoordinatesFromAbsolute(absoluteX, absoluteZ) {
    const chunkX = Math.floor(absoluteX / CONFIG.CHUNK_SIZE);
    const chunkZ = Math.floor(absoluteZ / CONFIG.CHUNK_SIZE);

    return { chunkX, chunkZ };
  }

  getChunk(x, z) {
    if (!this.blockChunks[x]) {
      return undefined;
    }
    if (!this.blockChunks[x][z]) {
      return undefined;
    }
    return this.blockChunks[x][z];
  }

  getChunkContainingAbsolute(absoluteX, absoluteZ) {
    const { chunkX, chunkZ } = MapData.getChunkCoordinatesFromAbsolute(absoluteX, absoluteZ);
    return this.getChunk(chunkX, chunkZ);
  }

  update() {
  }
}

module.exports = MapData;
