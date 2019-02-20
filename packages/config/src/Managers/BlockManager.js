const CONFIG = require('config');

class BlockManager {
  constructor() {}

  getBlockTypeByID(id) {
    return CONFIG.BLOCK_TYPES[id];
  }

  getBlockSize() { return CONFIG.BLOCK_SIZE; }
}

// Export an instance of the class
const instance = new BlockManager();
module.exports = instance;
