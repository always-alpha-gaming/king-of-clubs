const CONFIG = require('../../config.json');

class BlockManager {
  constructor() {}

  getBlockTypeByID(id) {
    return CONFIG.BLOCK_TYPES[id];
  }

  getBlockTypeByName(name) {
    for (let i = 0; i < this.getNumberBlockTypes(); i += 1) {
      if (CONFIG.BLOCK_TYPES[i] === name) { return CONFIG.BLOCK_TYPES[i]; }
    }
    return null;
  }

  getNumberBlockTypes() { return CONFIG.BLOCK_TYPES.length; }

  getBlockSize() { return CONFIG.BLOCK_SIZE; }

  getAirBLock() { return this.getBlockTypeByID(0); }

  getUnknownBLock() { return this.getBlockTypeByID(1); }
}

// Export an instance of the class
const instance = new BlockManager();
module.exports = instance;
