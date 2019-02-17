const { EVENTS } = require('config');
const io = require('socket.io')();
const gameState = require('./Game/Models/GameState')
const gameLoop = require('./Game/gameLoop');
// const ServerMapData = require('./Game/Models/ServerMapData');
// const map = new ServerMapData({});

// Begin Server Game Loop
gameLoop();

// Handle Client Connection
io.on('connection', client => {
  console.log('connection from client');
  client.emit('event', {t: EVENTS.WORLD_CREATE, d: gameState.map});

  gameState.map.getOrGenChunk(0, 0);
  gameState.map.getOrGenChunk(1, 1);
  gameState.map.getOrGenChunk(0, 1);
  gameState.map.getOrGenChunk(1, 0);
  gameState.map.blockChunks.forEach(row => {
    row.forEach(chunk => {
      client.emit('event', {t: EVENTS.CHUNK_CREATE, d: chunk})
    })
  })

});
io.listen(3000);