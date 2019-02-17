import { BlockChunkData } from 'game-objects';

export default class Chunk extends BlockChunkData {
  hasUpdated() {
    return false;
  }

  render() {
    const geometries = [];

    this.forEachBlock((block) => {
      if (!block) return;
      // check in all dimensions if there is null
      const [x, y, z] = block.position;
      // console.log(block.position);

      const renderTop = this.isBlockTransparent(x, y + 1, z);
      const renderBottom = (y !== 0 && this.isBlockTransparent(x, y - 1, z));
      const renderLeft = this.isBlockTransparent(x + 1, y, z);
      const renderRight = this.isBlockTransparent(x - 1, y, z);
      const renderFront = this.isBlockTransparent(x, y, z - 1);
      const renderBack = this.isBlockTransparent(x, y, z + 1);

      // ok
      if (
        true || renderTop || renderBottom || renderLeft || renderRight || renderFront || renderBack
      ) {
        geometries
          .push(...block.render(
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
