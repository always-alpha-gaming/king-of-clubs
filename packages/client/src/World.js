import CONFIG from 'config';
import { MapData } from 'game-objects';
import Block from './Block';
import Chunk from './Chunk';
import 'three';
import '../lib/BufferGeometryUtils';

function mod(value, modulus) {
  return (value % modulus + modulus) % modulus;
}

function intbound(s, ds) {
  // Find the smallest positive t such that s+t*ds is an integer.
  if (ds < 0) {
    return intbound(-s, -ds);
  } else {
    s = mod(s, 1);
    // problem is now s+t*ds = 1
    return (1 - s) / ds;
  }
}

function signum(x) {
  return x > 0 ? 1 : x < 0 ? -1 : 0;
}

export default class World {
  /**
   * @param {number} borderZ
   */
  constructor(borderZ, blocks) {
    this.map = new MapData({});
    this.blocks = blocks || [];
    this.chunksToUnMount = [];
    this.borderZ = borderZ;
    this.chunkToMesh = new WeakMap();
  }

  addChunk(chunk) {
    const [x, z] = chunk.position;

    if (this.map.getChunk(x, z)) {
      this.chunksToUnMount.push(this.map.getChunk(x, z));
    }

    const blocks = chunk.blocks
      .map(
        (i, x) => i
          .map(
            (j, y) => j
              .map((block, z) => {
                if (block !== null) {
                  return new Block(block);
                }
                return null;
              }),
          ),
      );

    this.map.addChunk(new Chunk({ ...chunk, blocks }));
  }

  getBlock(x, y, z) {
    const { chunkX, chunkZ } = MapData.getChunkCoordinatesFromAbsolute(x, z);

    if (!this.map.blockChunks[chunkX]) {
      return undefined;
    }
    if (!this.map.blockChunks[chunkX][chunkZ]) {
      return undefined;
    }
    return this.map.blockChunks[chunkX][chunkZ].getBlock(x, y, z);
  }

  update(delta) {
    // this.forEachBlock(block => block.update(delta));
  }

  draw(scene) {
    if (this.chunksToUnMount.length > 0) {
      this.chunksToUnMount.forEach((chunk) => {
        const mesh = this.chunkToMesh.get(chunk);
        scene.object3D.remove(mesh);
      });
      this.chunksToUnMount = [];
    }

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

  /**
   * Call the callback with (x,y,z,value,face) of all blocks along the line
   * segment from point 'origin' in vector direction 'direction' of length
   * 'radius'. 'radius' may be infinite.
   *
   * 'face' is the normal vector of the face of that block that was entered.
   * It should not be used after the callback returns.
   *
   * If the callback returns a true value, the traversal will be stopped.
   */
  raycast(origin, direction, radius) {
    // From "A Fast Voxel Traversal Algorithm for Ray Tracing"
    // by John Amanatides and Andrew Woo, 1987
    // <http://www.cse.yorku.ca/~amana/research/grid.pdf>
    // <http://citeseer.ist.psu.edu/viewdoc/summary?doi=10.1.1.42.3443>
    // Extensions to the described algorithm:
    //   • Imposed a distance limit.
    //   • The face passed through to reach the current cube is provided to
    //     the callback.

    // The foundation of this algorithm is a parameterized representation of
    // the provided ray,
    //                    origin + t * direction,
    // except that t is not actually stored; rather, at any given point in the
    // traversal, we keep track of the *greater* t values which we would have
    // if we took a step sufficient to cross a cube boundary along that axis
    // (i.e. change the integer part of the coordinate) in the variables
    // tMaxX, tMaxY, and tMaxZ.
    // console.log('Raycast called with ', origin, direction, radius);

    // Cube containing origin point.
    let x = Math.floor(origin.x);
    let y = Math.floor(origin.y);
    let z = Math.floor(origin.z);

    // console.log('initial coords', x, y, z);

    // Break out direction vector.
    const dx = direction.x;
    const dy = direction.y;
    const dz = direction.z;
    // Direction to increment x,y,z when stepping.
    const stepX = signum(dx);
    const stepY = signum(dy);
    const stepZ = signum(dz);
    // The change in t when taking a step (always positive).
    const tDeltaX = stepX / dx;
    const tDeltaY = stepY / dy;
    const tDeltaZ = stepZ / dz;
    // See description above. The initial values depend on the fractional
    // part of the origin.
    let tMaxX = intbound(origin.x, dx);
    let tMaxY = intbound(origin.y, dy);
    let tMaxZ = intbound(origin.z, dz);
    // Buffer for reporting faces to the callback.
    const face = new THREE.Vector3();

    // Avoids an infinite loop.
    if (dx === 0 && dy === 0 && dz === 0) {
      throw new RangeError('Raycast in zero direction!');
    }

    // Rescale from units of 1 cube-edge to units of 'direction' so we can
    // compare with 't'.
    radius /= Math.sqrt(dx * dx + dy * dy + dz * dz);

    while (true) {
      // console.log(`Probing ${x}, ${y}, ${z}`);
      // Invoke the callback, unless we are not *yet* within the bounds of the
      // world.
      if (this.getBlock(x, y, z)) {
        return {
          x,
          y,
          z,
          block: this.getBlock(x, y, z),
          face,
        };
      }

      // tMaxX stores the t-value at which we cross a cube boundary along the
      // X axis, and similarly for Y and Z. Therefore, choosing the least tMax
      // chooses the closest cube boundary. Only the first case of the four
      // has been commented in detail.
      if (tMaxX < tMaxY) {
        if (tMaxX < tMaxZ) {
          if (tMaxX > radius) return false;
          // Update which cube we are now in.
          x += stepX;
          // Adjust tMaxX to the next X-oriented boundary crossing.
          tMaxX += tDeltaX;
          // Record the normal vector of the cube face we entered.
          face.x = -stepX;
          face.y = 0;
          face.z = 0;
        } else {
          if (tMaxZ > radius) return false;
          z += stepZ;
          tMaxZ += tDeltaZ;
          face.x = 0;
          face.y = 0;
          face.z = -stepZ;
        }
      } else {
        if (tMaxY < tMaxZ) {
          if (tMaxY > radius) return false;
          y += stepY;
          tMaxY += tDeltaY;
          face.x = 0;
          face.y = -stepY;
          face.z = 0;
        } else {
          // Identical to the second case, repeated for simplicity in
          // the conditionals.
          if (tMaxZ > radius) return false;
          z += stepZ;
          tMaxZ += tDeltaZ;
          face.x = 0;
          face.y = 0;
          face.z = -stepZ;
        }
      }
    }
  }
}
