const CONFIG = require('config');

class BlockData {
  /**
   * Block Data Constructor
   * @param {Object} param0 Configuration object containing the following...
   * @param {Vector3} param0.position The Absolute Position of the Block
   * @param {Color?} param0.color A Named or Hex Color
   * @param {Number} param0.health The Health of this block
   * @param {Number} param0.maxHealth The Maximum Health of this block
   * @param {Number} param0.blockType The Block Type CONFIG Index of this Block
   */
  constructor({ id, position, color = null, health = null, maxHealth = null, blockType = 0 }) {
    this.id = id;
    this.position = position;
    this.color = color;
    this.blockType = CONFIG.BLOCK_TYPES[blockType];

    // Color
    if (typeof color !== 'string') {
      this.color = CONFIG.BLOCK_TYPES[blockType].color;
    } else {
      this.color = color;
    }

    // Health
    if (typeof health !== 'number') {
      this.health = CONFIG.BLOCK_TYPES[blockType].health;
    } else {
      this.health = health;
    }

    // Max Health
    if (typeof maxHealth !== 'number') {
      this.maxHealth = CONFIG.BLOCK_TYPES[blockType].health;
    } else {
      this.maxHealth = maxHealth;
    }
  }

  update() {}
}

module.exports = BlockData;
