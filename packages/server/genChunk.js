const CONFIG = require('config');
const SimplexNoise = require('simplex-noise');
const { BlockData, BlockChunkData } = require('game-objects');
const baseHeight = 64;

/**
 * Takes a chunk coordinate and generates a chunk, (chunk coordinates are not absolute coordinates)
 * @param {number} x
 * @param {number} z
 * @param {string} [seed]
 */
module.exports = function genChunk(x, z, seed = 'seed') {
  const simplex = new SimplexNoise(seed);

  const blocks = new Array(CONFIG.CHUNK_SIZE)
    .fill(0)
    .map(() => new Array(CONFIG.MAP_HEIGHT)
      .fill(0)
      .map(() => new Array(CONFIG.CHUNK_SIZE)
        .fill(null)));

  for (let relativeX = 0; relativeX < CONFIG.CHUNK_SIZE; relativeX++) {
    const absoluteX = (x * CONFIG.CHUNK_SIZE) + relativeX;
    for (let relativeZ = 0; relativeZ < CONFIG.CHUNK_SIZE; relativeZ++) {
      const absoluteZ = (z * CONFIG.CHUNK_SIZE) + relativeZ;
      const height = baseHeight + (10 * simplex.noise2D(0.2 * absoluteX, 0.2 * absoluteZ));

      for (let absoluteY = 0; absoluteY < height; absoluteY++) {
        blocks[relativeX][absoluteY][relativeZ] = new BlockData({
          id: `${absoluteX}|${absoluteY}|${absoluteZ}`,
          position: [absoluteX, absoluteY, absoluteZ],
          blockType: 2, // Stone
        });
      }
    }
  }
  
  return new BlockChunkData({id: `${x}|${z}`, blocks, position: [x, z]})
};
