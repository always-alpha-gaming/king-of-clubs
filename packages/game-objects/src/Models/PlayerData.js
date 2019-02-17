const { PLAYER } = require('config');

class PlayerData {
  /**
   * Player Data Constructor
   * @param {Object} param0 Configuration object containing the following...
   * @param {String} param0.id The Globally Unique ID of the Player
   * @param {Vector3} param0.position The Absolute Postion of the Player 
   * @param {Vector3} param0.rotation The Absolute Postion of the Player 
   * @param {Object} param0.teamIndex The Team CONFIG Index of this Team
   * @param {Number} param0.health The Health of this block
   */
  constructor({id, position, rotation, teamIndex, health = null }) {
    this.id = id;
    this.position = position;
    this.rotation = rotation;
    this.team = CONFIG.TEAMS[teamIndex];

    this.width = PLAYER.BASE_SIZE;
    this.depth = PLAYER.BASE_SIZE;
    this.height = PLAYER.HEIGHT;

    // Health
    if (typeof health !== 'number') {
      this.health = CONFIG.PLAYER.MAX_HEALTH;
    } else {
      this.health = health;
    }
  }

  update() {}
}

module.exports = PlayerData;
