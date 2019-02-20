const { PLAYER, TEAMS } = require('config');

class PlayerData {
  /**
   * Player Data Constructor
   * @param {Object} param0 Configuration object containing the following...
   * @param {Number} param0.id The Globally Unique ID of the Player
   * @param {Vector3} param0.position The Absolute Postion of the Player
   * @param {Vector3} param0.rotation The Absolute Postion of the Player
   * @param {Vector3} param0.movementDirection The Normalized Movement Direction of this player
   * @param {Object} param0.teamIndex The Team CONFIG Index of this Team
   * @param {Object} param0.team A team from the CONFIG
   * @param {Number} param0.health The Health of this block
   */
  constructor({
    id,
    position,
    rotation,
    teamIndex,
    team,
    health = null,
    movementDirection = { x: 0, y: 0, z: 0 },
  }) {
    this.id = id;
    this.position = position;
    this.rotation = rotation;
    this.team = team || TEAMS[teamIndex];
    this.movementDirection = movementDirection;

    this.width = PLAYER.BASE_SIZE;
    this.depth = PLAYER.BASE_SIZE;
    this.height = PLAYER.HEIGHT;

    // Health
    if (typeof health !== 'number') {
      this.health = PLAYER.MAX_HEALTH;
    } else {
      this.health = health;
    }
  }

  update() {}
}

module.exports = PlayerData;
