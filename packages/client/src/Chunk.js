import { BlockChunkData } from 'game-objects';
import Block from './Block';

export default class Chunk extends BlockChunkData {
  hasUpdated() {
    return false;
  }

  render(world) {
    const geometries = [];

    this.forEachBlock((block, position) => {
      if (!block) return;
      // check in all dimensions if there is null
      const [x, y, z] = position;
      // console.log(block.position);

      const renderTop = world.isBlockPassable(x, y + 1, z);
      const renderBottom = world.isBlockPassable(x, y - 1, z);
      const renderLeft = world.isBlockPassable(x + 1, y, z);
      const renderRight = world.isBlockPassable(x - 1, y, z);
      const renderFront = world.isBlockPassable(x, y, z - 1);
      const renderBack = world.isBlockPassable(x, y, z + 1);

      // ok
      if (
        true || renderTop || renderBottom || renderLeft || renderRight || renderFront || renderBack
      ) {
        geometries
          .push(...Block.render(
            block,
            [x, y, z],
            renderTop,
            renderBottom,
            renderLeft,
            renderRight,
            renderFront,
            renderBack,
          ));
      }
    });

    if (geometries.length === 0) return;

    const geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);
    geometry.computeBoundingSphere();

    const material = new THREE.MeshLambertMaterial({
      color: 'purple',
    });

    return new THREE.Mesh(geometry, material);
  }
}
