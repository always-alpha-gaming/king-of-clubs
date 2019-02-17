const io = require('socket.io')();
const CONFIG = require('config');
const gameState = require('../Models/GameState');

class ClientManager {
  constructor() {
    this.clients = [];
  }

  onConnected(socket) {
    this.printConsoleLog(socket, 'has connected');
    this.registerClient(socket);
  }

  onDisconnect(socket) {
    this.printConsoleLog(socket, 'has disconnected');
    this.deregisterClient(socket);
  }

  onClientTick(socket, data) {
    this.printConsoleLog(socket, 'has received Client Tick Event');
    gameState.receivedClientTick(socket, data);
  }

  onPlayerShoot(socket, data) {
    this.printConsoleLog(socket, 'has received a Player Shoot Event');
    gameState.receivedPlayerShoot(this, socket, data);
  }

  onBlockPlace(socket, data) {
    this.printConsoleLog(socket, 'has received a Block Place Event');
    gameState.receivedBlockPlace(socket, data);
  }

  onBlockDelete(socket, data) {
    this.printConsoleLog(socket, 'has received a Block Delete Event');
    gameState.receivedBlockDelete(socket, data);
  }

  printConsoleLog(socket, message) {
    const address = socket.handshake.address; // address.address + ':' + address.port
    // var clientIPAddress = socket.request.connection.remoteAddress;
    console.log(`Client (${address}) ${message}`);
  }

  /**
   * Registers the Socket with the Client Manager and the GameState
   * @param {*} socket
   */
  registerClient(socket) {
    this.clients.push(socket);
    gameState.registerPlayer(this, socket);
  }

  /**
   * Deregisters the socket with the Client Manager and the GameState
   * @param {*} socket
   */
  deregisterClient(socket) {
    const i = this.clients.indexOf(socket);
    this.clients.splice(i, 1);
    gameState.deregisterPlayer(this, socket);
  }

  /**
   * Broadcasts a message to all the connected clients
   * @param {Number} type An Event Type from the Consts
   * @param {*} data Data to be broadcasted
   */
  broadcastMessage(eventType, data) {
    this.clients.forEach((client) => {
      this.broadcastMessageToSocket(client, eventType, data);
    });
  }

  /**
   * Broadcasts a message to the specified client
   * @param {*} socket The socket we will send the data to
   * @param {Number} type An Event Type from the Consts
   * @param {*} data Data to be broadcasted
   */
  broadcastMessageToSocket(socket, eventType, data) {
    socket.emit('event', { t: eventType, d: data });
  }
}

// Export an instance of the class
const instance = new ClientManager();
module.exports = instance;
