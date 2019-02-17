const io = require('socket.io')();
const { EVENTS } = require('config');
const gameState = require('../Models/GameState');

class ClientManager {
    constructor() {
        this.clients = [];
    }

    onConnected(socket) {
        // Register the Client with the ClientManager
        registerClient(socket);
    }

    registerClient(socket) {
        this.clients.push(socket);
        gameState.registerPlayer(socket);
    }
    deregisterClient(socket) {
        gameState.deregisterPlayer(socket);
    }
}

// Export an instance of the class
const instance = new ClientManager();
module.exports = instance;