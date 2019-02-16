class BlockData {
  constructor(id, position, color, health) {
    this.id = id;
    this.position = position;
    this.health = health;
    this.color = color;
  }

  update() {}
}

module.exports = BlockData;
