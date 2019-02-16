class Block {
  constructor({ id, position, color = null, health = 3, blockType = 'AIR' }) {
    this.id = id;
    this.position = position;
    this.color = color;
    this.health = health;
    this.blockType = blockType;
  }
}
