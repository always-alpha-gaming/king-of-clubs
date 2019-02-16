const CONFIG = require('config');
const SimplexNoise = require('simplex-noise');

/**
 * Takes a chunk coordinate and generates a chunk, (chunk coordinates are not absolute coordinates)
 * @param {number} x
 * @param {number} z
 * @param {string} [seed]
 */
function genChunk(x, z, seed='seed') {
  const simplex = new SimplexNoise(seed);

  const map = new Array(CONFIG.CHUNK_SIZE)
    .fill(0)
    .map(() => new Array(CONFIG.MAP_SIZE)
      .fill(0)
      .map(() => new Array(CONFIG.CHUNK_SIZE)));

  for (let gx = 0; gx < CONFIG.CHUNK_SIZE; gx++) {
    for (let zx = 0; zx < CONFIG.CHUNK_SIZE; zx++) {

    }
  }
}
