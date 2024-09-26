const CONFIG = require('config');

class BlockData {
  static getBlockTypeID(block) {
    // eslint-disable-next-line no-bitwise
    return (block & 0b11111000) >> 3;
  }

  static getBlockType(block) {
    return CONFIG.BLOCK_TYPES[BlockData.getBlockTypeID(block)];
  }

  static getBlockHealth(block) {
    // eslint-disable-next-line no-bitwise
    return block & 0b111;
  }

  static getBlockSerialized(typeID, health) {
    // eslint-disable-next-line no-bitwise
    return (typeID << 3) + health;
  }

  /**
   * describes if users or the user's cursor can pass through a block
   * @param {number} block
   * @returns {boolean}
   */
  static allowsPassthrough(block) {
    const blockType = BlockData.getBlockType(block);

    return blockType.passable;
  }
}

module.exports = BlockData;
