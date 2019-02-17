const io = require('socket.io')();
const CONFIG = require('config');
const gameState = require('../Models/GameState');

class ClientManager {
    constructor() {
        this.clients = [];
    }

    onConnected(socket) {
        var address = socket.handshake.address; // address.address + ':' + address.port
        // var clientIPAddress = socket.request.connection.remoteAddress;
        console.log('Client ('+address+') has connected');

        // Register the Client with the ClientManager
        this.registerClient(socket);
    }
    onDisconnect(socket) {
        var address = socket.handshake.address; // address.address + ':' + address.port
        // var clientIPAddress = socket.request.connection.remoteAddress;
        console.log('Client ('+address+') has disconnected');
        
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
        gameState.deregisterPlayer(this, socket);
    }

    /**
     * Broadcasts a message to all the connected clients
     * @param {Number} type An Event Type from the Consts
     * @param {*} data Data to be broadcasted
     */
    broadcastMessage(eventType, data) {
        this.clients.forEach(client => {
            client.emit('event', {t: eventType, d: data});
        })
    }
}

// Export an instance of the class
const instance = new ClientManager();
module.exports = instance;