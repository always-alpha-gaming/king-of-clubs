class BlockData {
  constructor(id, position, color, health, blockType) {
    this.id = id;
    this.position = position;
    this.health = health;
    this.color = color;
    this.blockType = blockType;
  }

  update() {}
}

module.exports = BlockData;
