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

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomPlayerPosition() {
    const randomX = this.getRandomInt(5, 64);
    const randomZ = this.getRandomInt(5, 64);
    const position = { x: randomX, y: 50, z: randomZ };
    return position;
  }

  getRandomPlayerRotation() {
    const rotation = { x: 0, y: 0, z: 0 };
    return rotation;
  }

  getAllPlayerData() {
    const data = [];
    this.players.forEach((pair) => {
      data.push(pair.playerData);
    })
    return data;
  }

  getAllPlayerDataExcept(playerData) {
    const data = [];
    this.players.forEach((pair) => {
      if (pair.playerData === playerData) return;
      data.push(pair.playerData);
    });
    return data;
  }

  getSocketPlayerPairFromSocket(socket) {
    for (let i = 0; i < this.players.length; i++) {
      const pair = this.players[i];
      if (pair.socket === socket) {
        return pair;
      }
    }
    return null;
  }

  getSocketPlayerPairFromPlayerData(playerData) {
    for (let i = 0; i < this.players.length; i++) {
      const pair = this.players[i];
      if (pair.playerData === playerData) {
        return pair;
      }
    }
    return null;
  }

  getSocketPlayerPairFromPlayerID(playerID) {
    for (let i = 0; i < this.players.length; i++) {
      const pair = this.players[i];
      if (pair.playerData.id === playerID) {
        return pair;
      }
    }
    return null;
  }

  registerPlayer(clientManager, socket) {
    const startingPosition = this.getRandomPlayerPosition();
    const startingRotation = this.getRandomPlayerRotation();
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
    clientManager.broadcastMessageToSocket(socket, CONFIG.EVENTS.WORLD_CREATE, initialState);

    // Broadcast their initial chunks
    this.map.forEachChunk((chunk) => {
      console.log(`Sending chunk with pos ${chunk.position} to client`);
      clientManager.broadcastMessageToSocket(socket, CONFIG.EVENTS.CHUNK_CREATE, chunk);
    });

    // Broadcast the player to all active players
    clientManager.broadcastMessage(CONFIG.EVENTS.PLAYER_ENTER_RANGE, newPlayer);
  }

  deregisterPlayer(clientManager, socket) {
    const leavingPlayerSocketPair = this.getSocketPlayerPairFromSocket(socket);

    // Loop through the remaining players and Notify that a player has left
    if (leavingPlayerSocketPair == null) return;
    clientManager.broadcastMessage(CONFIG.EVENTS.PLAYER_LEAVE_RANGE, leavingPlayerSocketPair.playerData);
  }

  receivedClientTick(socket, data) {
    const playerSocketPair = this.getSocketPlayerPairFromSocket(socket);
    if (playerSocketPair == null) return;
    if (playerSocketPair.playerData.health <= 0) return; // Ignore ticks from dead players
    playerSocketPair.playerData = data.me;
    // console.log(data);
  }

  receivedPlayerShoot(clientManager, socket, data) {
    console.log('Data: ' + data);

    // Get the Socket of the Player
    const playerSocketPair = this.getSocketPlayerPairFromSocket(socket);
    if (playerSocketPair == null) return;
    //console.log('Shooter ID: ' + playerSocketPair.playerData.id);

    // Get the Target ID
    var targetID = data.targetID;
    const targetSocketPair = this.getSocketPlayerPairFromPlayerID(targetID);
    if (targetSocketPair == null) return;
    //console.log('Target ID: ' + targetSocketPair.playerData.id);

    // Decrease the Health...
    targetSocketPair.playerData.health--;

    // If the target player is dead...
    if (targetSocketPair.playerData.health <= 0) {
      // Reset their spawn and rotation
      targetSocketPair.playerData.position = this.getRandomPlayerPosition();
      targetSocketPair.playerData.rotation = this.getRandomPlayerRotation();
      targetSocketPair.playerData.health = -999;
      clientManager.broadcastMessage(CONFIG.EVENTS.PLAYER_LEAVE_RANGE, targetSocketPair.playerData);
    }
  }

  receivedBlockPlace(socket, data) {
    const playerSocketPair = this.getSocketPlayerPairFromSocket(socket);
    if (playerSocketPair == null) return;
    const [x, y, z] = data.position;
    const chunk = this.map.getChunkContainingAbsolute(x, z);
    chunk.setBlock(x, y, z, new BlockData({ id: `${x}|${y}|${z}`, position: [x, y, z], blockType: 2 }));
  }

  receivedBlockDelete(socket, data) {
    const playerSocketPair = this.getSocketPlayerPairFromSocket(socket);
    if (playerSocketPair == null) return;
    const [x, y, z] = data.position;
    const chunk = this.map.getChunkContainingAbsolute(x, z);
    chunk.setBlock(x, y, z, null);
  }

  receivedPlayerFellOffWorld(clientManager, socket, data) {
    const playerSocketPair = this.getSocketPlayerPairFromSocket(socket);
    if (playerSocketPair == null) return;

    // Just respawn them
    playerSocketPair.playerData.position = this.getRandomPlayerPosition();
    playerSocketPair.playerData.rotation = this.getRandomPlayerRotation();

    // And resend to client
    const fellOffWorldData {
      position: playerSocketPair.playerData.position,
      rotation: playerSocketPair.playerData.rotation
    }
    clientManager.broadcastMessageToSocket(socket, CONFIG.EVENTS.FELL_OFF_WORLD, fellOffWorldData)
  }
}

// Export an instance of the class
const instance = new GameState();
module.exports = instance;
