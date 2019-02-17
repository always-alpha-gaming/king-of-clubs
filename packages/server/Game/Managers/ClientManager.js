const io = require('socket.io')();
const { EVENTS } = require('config');
const gameState = require('../Models/GameState');

class ClientManager {
    constructor() {
        this.clients = [];
    }

    registerClient(client) {
        this.clients.push(client);
        gameState.registerPlayer(client);
    }
    deregisterClient(client) {
        
    }
}

// Export an instance of the class
const instance = new ClientManager();
module.exports = instance;