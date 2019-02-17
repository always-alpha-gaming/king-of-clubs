const { MapData } = require('game-objects');
const genChunk = require('../Services/genChunk');

module.exports = class ServerMapData extends MapData {
  getOrGenChunk(x, z) {
    const possibleChunk = this.getChunk(x, z);
    if (possibleChunk) return possibleChunk;
    const newChunk = genChunk(x, z, this.perlinSeed);
    this.addChunk(newChunk);
    return newChunk;
  }
};
