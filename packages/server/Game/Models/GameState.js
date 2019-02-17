const ServerMapData = require('./ServerMapData');
const SocketPlayerPair = require('./SocketPlayerPair');
const idManager = require('../Managers/IDManager');

class GameState {
    constructor() {
        this.map = new ServerMapData({});
        this.players = [];

        // Initialize the map with some chunks
        this.map.getOrGenChunk(0, 0);
        this.map.getOrGenChunk(1, 1);
        this.map.getOrGenChunk(0, 1);
        this.map.getOrGenChunk(1, 0);
    }

    registerPlayer(socket) {
        const startingPosition = {x:0, y:0, z:0};
        const startingRotation = {x:0, y:0, z:0};
        const teamIndex = 0;

        // Create the Player Data
        const newPlayer = new PlayerData(
        {
            id:idManager.getNewID(),
            position: startingPosition,
            rotation: startingRotation,
            teamIndex: teamIndex
        });

        // Create the Socket Player Pair and Add them to the list
        const socketPlayerPair = new SocketPlayerPair(socket, newPlayer);
        this.players.push(socketPlayerPair);

        // Broadcast the Initial GameState to this player
        const initialState = {map: this.map, me: newPlayer};
        socket.emit('event', {t: EVENTS.WORLD_CREATE, d: initialState});

        // Broadcast their initial chunks
        this.map.blockChunks.forEach(row => {
            row.forEach(chunk => {
                socket.emit('event', {t: EVENTS.CHUNK_CREATE, d: chunk})
            })
        })
    }

    deregisterPlayer(socket) {

    }
}

// Export an instance of the class
const instance = new GameState();
module.exports = instance;