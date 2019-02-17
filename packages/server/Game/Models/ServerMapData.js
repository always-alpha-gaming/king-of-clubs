const { MapData } = require('game-objects');
const genChunk = require('../Services/genChunk');

module.exports = class ServerMapData extends MapData {
  getOrGenChunk(x, z) {
    if (!Array.isArray(this.blockChunks[x])) {
      this.blockChunks[x] = [];
    }
    if (Array.isArray(this.blockChunks[x][z])) {
      return this.blockChunks[x][z];
    }
    const chunk = genChunk(x, z, this.perlinSeed);
    this.blockChunks[x][z] = chunk;
    return chunk;
  }
};
