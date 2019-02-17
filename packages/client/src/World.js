import Block from './Block';

let dot = true;
setTimeout(() => {
  dot = false;
}, 10000);

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
    if (block === null) {
      return; // TODO: Generate air block on the fly
    }
    const blockObject = new Block(block);
    const [x, y, z] = blockObject.position;

    if (!this.blocks[x]) {
      this.blocks[x] = [];
    }
    if (!this.blocks[x][y]) {
      this.blocks[x][y] = [];
    }

    this.blocks[x][y][z] = blockObject;
  }

  addChunk(chunk) {
    chunk.blocks.forEach(
      y => y.forEach(
        z => z.forEach(
          block => this.addBlock(block),
        ),
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
        z => z.forEach(
          block => fn(block),
        ),
      ),
    );
  }

  update(delta) {
    // this.forEachBlock(block => block.update(delta));
  }

  draw(scene) {
    if (!dot) {
      console.log('ret');
      return;
    } else {
      console.log('draw');
    }

    this.forEachBlock((block) => {
      // check in all dimensions if there is null
      const [x, y, z] = block.position;

      const renderTop = !this.getBlock(x, y + 1, z);
      const renderBottom = (y !== 0 && !this.getBlock(x, y - 1, z));
      const renderLeft = !this.getBlock(x + 1, y, z);
      const renderRight = !this.getBlock(x - 1, y, z);
      const renderFront = !this.getBlock(x, y, z - 1);
      const renderBack = !this.getBlock(x, y, z + 1);

      // ok
      if (
        renderTop || renderBottom || renderLeft || renderRight || renderFront || renderBack
      ) {
        block.draw(scene, renderTop, renderBottom, renderLeft, renderRight, renderFront, renderBack);
      }
    });
  }
}
