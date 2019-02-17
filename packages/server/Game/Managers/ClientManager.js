const io = require('socket.io')();
const { EVENTS } = require('config');
const gameState = require('../Models/GameState');

class ClientManager {
    constructor() {
        this.clients = [];
    }

    onConnected(socket) {
        // Register the Client with the ClientManager
        const socketPlayerPair = registerClient(socket);

        // Broadcast the Initial GameState
        const initialState = {map: gameState.map, me: socketPlayerPair.playerData};
        client.emit('event', {t: EVENTS.WORLD_CREATE, d: initialState});

        // Broadcast their initial chunks
        gameState.map.blockChunks.forEach(row => {
            row.forEach(chunk => {
            client.emit('event', {t: EVENTS.CHUNK_CREATE, d: chunk})
            })
        })
    }

    registerClient(socket) {
        this.clients.push(socket);
        const socketPlayerPair = gameState.registerPlayer(socket);
        return socketPlayerPair.playerData;
    }
    deregisterClient(socket) {
        gameState.deregisterPlayer(socket);
    }
}

// Export an instance of the class
const instance = new ClientManager();
module.exports = instance;