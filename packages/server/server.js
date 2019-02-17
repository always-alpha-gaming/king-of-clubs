const CONFIG = require('config');
const io = require('socket.io')();
const clientManager = require('./Game/Managers/ClientManager');
const gameLoop = require('./Game/gameLoop');

// Begin Server Game Loop
gameLoop();

// Handle The Client Connection
io.on('connection', (socket) => {
  clientManager.onConnected(socket);

  // Handle The Client Disconnect
  socket.once('disconnect', () => {
    clientManager.onDisconnect(socket);
  });

  // Handle the Client Updates
  socket.on(CONFIG.EVENTS.CLIENT_TICK, (data) => {
    clientManager.onClientTick(socket, data);
  });
  socket.on(CONFIG.EVENTS.PLAYER_SHOOT, (data) => {
    clientManager.onPlayerShoot(socket, data);
  });
  socket.on(CONFIG.EVENTS.BLOCK_PLACE, (data) => {
    clientManager.onBlockPlace(socket, data);
  });
  socket.on(CONFIG.EVENTS.BLOCK_DELETE, (data) => {
    clientManager.onBlockDelete(socket, data);
  });
  socket.on(CONFIG.EVENTS.FELL_OFF_WORLD, (data) => {
    clientManager.onFellOffWorld(socket, data);
  });
});

// Start the Server and Listen on Port 3000
io.listen(3000);
console.log('Server listening on Port 3000 | http://localhost:3000/');
