const { MapData } = require('game-objects');
const genChunk = require('./genChunk');

module.exports = class ServerMapData extends MapData {
  getOrGenChunk(x, z) {
    if (this.blockChunks[x] && this.blockChunks[x][z]) {
      return this.blockChunks[x][z];
    }
    const chunk = genChunk(x, z, this.perlinSeed);
    this.blockChunks[x][z] = chunk;
    return chunk;
  }
};
