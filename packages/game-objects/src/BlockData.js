class BlockData {
  /**
   * Block Data Constructor 
   * @param {Object} param0 Configuration object containing the following...
   * @param {Vector3} param0.position The Absolute Position of the Block
   * @param {Color?} param0.color A Named or Hex Colour
   * @param {Number} param0.health The Health of this block
   * @param {Object} param0.blockType The Block Type of this Block
   */
  constructor({ id, position, color = null, health = 3, blockType = 'AIR' }) {
    this.id = id;
    this.position = position;
    this.color = color;
    this.health = health;
    this.blockType = blockType;
  }

  update() {}
}

module.exports = BlockData;
