class PlayerData {
  /**
   * Player Data Constructor
   * @param {Object} param0 Configuration object containing the following...
   * @param {String} param0.id The Globally Unique ID of the Player
   * @param {Vector3} param0.position The Absolute Postion of the Player 
   * @param {Vector3} param0.rotation The Absolute Postion of the Player 
   * @param {Object} param0.team The Team of this Player
   * @param {Number} param0.health The Health of this block
   * @param {Number} param0.maxHealth The Maximum Health of this block
   */
  constructor({id, position, rotation, team, health = null, maxHealth = null }) {
    this.id = id;
    this.position = position;
    this.rotation = rotation;
    this.team = team;
    
    // Health
    if (typeof health !== 'number') {
      this.health = CONFIG.BLOCK_TYPES[blockType].health;
    } else {
      this.health = health;
    }

    // Max Health
    if (typeof maxHealth !== 'number') {
      this.maxHealth = CONFIG.BLOCK_TYPES[blockType].health;
    } else {
      this.maxHealth = maxHealth;
    }
  }

  update() {}
}

module.exports = PlayerData;
