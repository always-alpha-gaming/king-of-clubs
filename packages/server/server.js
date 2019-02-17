const io = require('socket.io')();
const clientManager = require('./Game/Managers/ClientManager');
const gameLoop = require('./Game/gameLoop');

// Begin Server Game Loop
gameLoop();

// Handle Client Connection
io.on('connection', client => {
  console.log('connection from client');

  // Notify the ClientManager that someone connected
  clientManager.onConnected(client);
});
io.listen(3000);