const { EVENTS } = require('config');
const io = require('socket.io')();
const clientManager = require('./Game/Managers/ClientManager');
const gameState = require('./Game/Models/GameState')
const gameLoop = require('./Game/gameLoop');

// Begin Server Game Loop
gameLoop();

// Handle Client Connection
io.on('connection', client => {
  console.log('connection from client');

  // Register the Client with the ClientManager
  clientManager.registerClient(client);

  // Broadcast the Initial GameState
  client.emit('event', {t: EVENTS.WORLD_CREATE, d: gameState.map});
  gameState.map.blockChunks.forEach(row => {
    row.forEach(chunk => {
      client.emit('event', {t: EVENTS.CHUNK_CREATE, d: chunk})
    })
  })

});
io.listen(3000);