import { createElement } from './utilities';

export default class World {
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

  addChunk(chunk) {
    chunk.blocks.forEach(
      y => y.forEach(
        block => this.addBlock(block),
      ),
    );
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

  forEachBlock(fn) {
    this.blocks.forEach(
      y => y.forEach(
        block => fn(block),
      ),
    );
  }

  update(delta) {
    this.forEachBlock(block => block.update(delta));
  }

  draw(scene) {
    this.forEachBlock(block => block.draw(scene));
  }
}
