const CONFIG = require('config');
const BlockDataOwn = require('./BlockData');

/**
 * Takes a Uint8Array and converts it to a string in hex with two characters representing each byte
 * @param {Uint8Array} array
 * @returns {string}
 */
function uint8ArrayToString(array) {
  return new TextDecoder('utf-8').decode(array);
}

/**
 * Takes a string with two hex characters representing each byte and creates a Uint8Array
 * @param {string} str
 * @param {number} length size of the Uint8Array to pad too.
 * @returns {Uint8Array}
 */
function stringToUint8Array(str, length) {
  return new TextEncoder('utf-8').encode(str);
  /* const bufView = new Uint8Array(length);
  const strLength = str.length / 2;
  if (strLength > length) {
    throw new Error('Received more data then a chunk size');
  }
  for (let i = 0; i < strLength; i += 1) {
    const strIndex = i * 2;
    bufView[i] = Number.parseInt(str[strIndex] + str[strIndex + 1], 16);
  }
  return bufView; */
}

class BlockChunkData {
  /**
   * Block Chunk Data Constructor
   * @param {Object} param0 Configuration object containing the following...
   * @param {String} param0.id The Globally Unique ID of the Chunk
   * @param {Uint8Array} param0.dataArray Uint8Array representation of map
   * @param {string} param0.data String representation of map
   * @param {Vector3} param0.position The Absolute Position of the chunk
   * @param {BlockData<Class>} param0.BlockData The Block Data class to use

   */
  constructor({ id, data, dataArray, position, BlockData }) {
    this.BlockData = BlockData || BlockDataOwn;
    this.id = id;
    if (dataArray) {
      this.data = dataArray;
    } else {
      this.data = stringToUint8Array(
        data,
        CONFIG.CHUNK_SIZE * CONFIG.CHUNK_SIZE * CONFIG.MAP_HEIGHT,
      );
    }
    this.position = position;
  }

  toJSON() {
    return {
      id: this.id,
      position: this.position,
      data: uint8ArrayToString(this.data),
    };
  }

  static to1D(x, y, z) {
    return (z * CONFIG.MAP_HEIGHT * CONFIG.CHUNK_SIZE) + (y * CONFIG.CHUNK_SIZE) + x;
  }

  static to3D(index) {
    const z = Math.floor(index / (CONFIG.CHUNK_SIZE * CONFIG.MAP_HEIGHT));
    index -= (z * CONFIG.CHUNK_SIZE * CONFIG.MAP_HEIGHT);
    const y = index / CONFIG.CHUNK_SIZE;
    const x = index % CONFIG.CHUNK_SIZE;
    return [Math.floor(x), Math.floor(y), z];
  }

  forEachBlock(fn) {
    this.data.forEach((data, index) => {
      const [x, y, z] = BlockChunkData.to3D(index);

      fn(data, this.toAbsolute(x, y, z));
    });
  }

  blockAllowsPassthrough(absoluteX, absoluteY, absoluteZ) {
    const block = this.getBlock(absoluteX, absoluteY, absoluteZ);
    if (!block) return true;
    return this.BlockData.allowsPassthrough(block);
  }

  getBlock(absoluteX, absoluteY, absoluteZ) {
    return this.getBlockRelative(
      absoluteX - (CONFIG.CHUNK_SIZE * this.position[0]),
      absoluteY,
      absoluteZ - (CONFIG.CHUNK_SIZE * this.position[1]),
    );
  }

  toAbsolute(relativeX, relativeY, relativeZ) {
    const absoluteX = relativeX + (CONFIG.CHUNK_SIZE * this.position[0]);
    const absoluteY = relativeY;
    const absoluteZ = relativeZ + (CONFIG.CHUNK_SIZE * this.position[1]);

    return [absoluteX, absoluteY, absoluteZ];
  }

  toRelative(absoluteX, absoluteY, absoluteZ) {
    const relativeX = absoluteX - (CONFIG.CHUNK_SIZE * this.position[0]);
    const relativeY = absoluteY;
    const relativeZ = absoluteZ - (CONFIG.CHUNK_SIZE * this.position[1]);

    return [relativeX, relativeY, relativeZ];
  }

  setBlock(absoluteX, absoluteY, absoluteZ, block) {
    const [relativeX, relativeY, relativeZ] = this.toRelative(absoluteX, absoluteY, absoluteZ);

    const index = BlockChunkData.to1D(relativeX, relativeY, relativeZ);

    this.data[index] = block;
  }

  getBlockRelative(x, y, z) {
    const index = BlockChunkData.to1D(x, y, z);
    return this.data[index];
  }

  update() {
  }
}

module.exports = BlockChunkData;
