import { MapData } from 'game-objects';
import Block from './Block';
import Chunk from './Chunk';
import 'three';
import '../lib/BufferGeometryUtils';

let dot = true;
setTimeout(() => {
  dot = false;
}, 10000);

export default class World {
  /**
   * @param {number} borderZ
   */
  constructor(borderZ, blocks) {
    this.map = new MapData({});
    this.blocks = blocks || [];
    this.borderZ = borderZ;
    this.chunkToMesh = new WeakMap();
  }

  addChunk(chunk) {
    console.log(chunk.blocks);

    const blocks = chunk.blocks
      .map(
        (i, x) => i
          .map(
            (j, y) => j
              .map((block, z) => {
                if (block !== null) {
                  return new Block(block);
                }
                return new Block({ id: `${x}|${y}|${z}`, position: [x, y, z], blockType: 1 });
              }),
          ),
      );

    console.log(blocks);

    this.map.addChunk(new Chunk({ ...chunk, blocks }));
  }

  update(delta) {
    // this.forEachBlock(block => block.update(delta));
  }

  draw(scene) {
    this.map.forEachChunk((chunk) => {
      const oldMesh = this.chunkToMesh.get(chunk);
      const updated = chunk.hasUpdated() === true;

      if (oldMesh && updated) {
        scene.object3D.remove(oldMesh);
      }
      if (!oldMesh || updated) {
        const newMesh = chunk.render();
        if (!newMesh || newMesh.length === 0) return;
        this.chunkToMesh.set(chunk, newMesh);
        scene.object3D.add(newMesh);
      }
    });
  }
}
