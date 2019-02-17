const CONFIG = require('config');
const { PlayerData } = require('game-objects');
const ServerMapData = require('./ServerMapData');
const SocketPlayerPair = require('./SocketPlayerPair');
const idManager = require('../Managers/IDManager');

class GameState {
  constructor() {
    this.map = new ServerMapData({});
    this.players = [];

    for (let x = -2; x < 2; x += 1) {
      for (let z = -2; z < 2; z += 1) {
        this.map.getOrGenChunk(x, z);
      }
    }
  }

  registerPlayer(socket) {
    const startingPosition = { x: 0, y: 0, z: 0 };
    const startingRotation = { x: 0, y: 0, z: 0 };
    const teamIndex = 0;

    // Create the Player Data
    const newPlayer = new PlayerData(
      {
        id: idManager.getNewID(),
        position: startingPosition,
        rotation: startingRotation,
        teamIndex,
      },
    );

    // Create the Socket Player Pair and Add them to the list
    const socketPlayerPair = new SocketPlayerPair(socket, newPlayer);
    this.players.push(socketPlayerPair);

    // Broadcast the Initial GameState to this player
    const initialState = { map: this.map, me: newPlayer };
    socket.emit('event', { t: CONFIG.EVENTS.WORLD_CREATE, d: initialState });

    // Broadcast their initial chunks
    this.map.forEachChunk((chunk) => {
      console.log(`Sending chunk with pos ${chunk.position} to client`);
      socket.emit('event', { t: CONFIG.EVENTS.CHUNK_CREATE, d: chunk });
    });
  }

  deregisterPlayer(clientManager, socket) {
    // Go through all of the players...
    let leavingPlayerSocketPair = null;
    for (let i = 0; i < this.players.length; i++) {
      // Find the connected Socket...
      const playerSocketPair = this.players[i];
      if (playerSocketPair.socket === socket) {
        leavingPlayerSocketPair = playerSocketPair;
        // When found, remove it from the Players list
        const index = this.players.indexOf(socket);
        this.players.splice(index, 1);

        // Break out of the loop
        break;
      }
    }

    // Loop through the remaining players and Notify that a player has left
    if (leavingPlayerSocketPair == null) return;
    clientManager.broadcastMessage(CONFIG.EVENTS.PLAYER_LEAVE_RANGE, leavingPlayerSocketPair.playerData);
  }
}

// Export an instance of the class
const instance = new GameState();
module.exports = instance;
