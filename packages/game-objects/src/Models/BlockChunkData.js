const CONFIG = require('config');

class BlockChunkData {
  /**
   * Block Chunk Data Constructor
   * @param {Object} param0 Configuration object containing the following...
   * @param {String} param0.id The Globally Unique ID of the Chunk
   * @param {Array3D<BlockChunkData>} param0.blocks The Blocks within the Chunk within a 3D Multi-Dimensional Array
   * @param {Vector3} param0.position The Absolute Postion of the chunk
   */
  constructor({ id, blocks, position }) {
    this.id = id;
    this.blocks = blocks;
    this.position = position;
  }

  forEachBlock(fn) {
    this.blocks.forEach(
      y => y.forEach(
        z => z.forEach(
          block => fn(block),
        ),
      ),
    );
  }

  isBlockTransparent(absoluteX, absoluteY, absoluteZ) {
    const block = this.getBlock(absoluteX, absoluteY, absoluteZ);
    if (!block) return true;
    return block.isTransparent();
  }

  getBlock(absoluteX, absoluteY, absoluteZ) {
    return this.getBlockRelative(
      absoluteX - (CONFIG.CHUNK_SIZE * this.position[0]),
      absoluteY,
      absoluteZ - (CONFIG.CHUNK_SIZE * this.position[1]),
    );
  }

  setBlock(absoluteX, absoluteY, absoluteZ, block) {
    const relativeX = absoluteX - (CONFIG.CHUNK_SIZE * this.position[0]);
    const relativeY = absoluteY;
    const relativeZ = absoluteZ - (CONFIG.CHUNK_SIZE * this.position[1]);

    if (!Array.isArray(this.blocks[relativeX])) {
      this.blocks[relativeX] = [];
    }

    if (!Array.isArray(this.blocks[relativeX][relativeY])) {
      this.blocks[relativeX][relativeY] = [];
    }

    if (!Array.isArray(this.blocks[relativeX][relativeY][relativeZ])) {
      this.blocks[relativeX][relativeY][relativeZ] = [];
    }

    this.blocks[relativeX][relativeY][relativeZ] = block;
  }

  getBlockRelative(x, y, z) {
    if (!this.blocks[x]) {
      return undefined;
    }
    if (!this.blocks[x][y]) {
      return undefined;
    }
    return this.blocks[x][y][z];
  }

  update() {
  }
}

module.exports = BlockChunkData;
