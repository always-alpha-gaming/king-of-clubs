const io = require('socket.io')();
const CONFIG = require('config');
const gameState = require('../Models/GameState');

class ClientManager {
    constructor() {
        this.clients = [];
    }

    onConnected(socket) {
        var address = socket.handshake.address;
        console.log('Client ('+address.address + ':' + address.port+') has connected');

        // Register the Client with the ClientManager
        this.registerClient(socket);
    }
    onDisconnect(socket) {
        var address = socket.handshake.address;
        console.log('Client ('+address.address + ':' + address.port+') has disconnected');
        
        // Register the Client with the ClientManager
        this.deregisterClient(socket);
    }

    registerClient(socket) {
        this.clients.push(socket);
        gameState.registerPlayer(socket);
    }
    deregisterClient(socket) {
        var i = this.clients.indexOf(socket);
        this.clients.splice(i, 1);
        gameState.deregisterPlayer(socket);
    }
}

// Export an instance of the class
const instance = new ClientManager();
module.exports = instance;