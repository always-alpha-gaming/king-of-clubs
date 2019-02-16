class World {
  /**
   * @param {number} borderZ
   */
  constructor(borderZ, blocks) {
    this.blocks = blocks || [];
    this.borderZ = borderZ;
  }

  /**
   * @param {BlockData} block
   */
  addBlock(block) {
    const [x, y, z] = block.position;

    if (!this.blocks[x]) {
      this.blocks[x] = [];
    }
    if (!this.blocks[x][y]) {
      this.blocks[x][y] = [];
    }

    this.block[x][y][z] = block;
  }

  getBlock(x, y, z) {
    if (!this.blocks[x]) {
      return undefined;
    }
    if (!this.blocks[x][y]) {
      return undefined;
    }
    return this.blocks[x][y][z];
  }
}

module.exports = World;
