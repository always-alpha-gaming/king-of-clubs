const io = require('socket.io')();
const clientManager = require('./Game/Managers/ClientManager');
const gameLoop = require('./Game/gameLoop');

// Begin Server Game Loop
gameLoop();

// Handle The Client Connection
io.on('connection', (socket) => {
  clientManager.onConnected(socket);

  // Handle The Client Disconnect
  socket.once('disconnect', function() {
    clientManager.onDisconnect(socket);
  });
});

// Start the Server and Listen on Port 3000
io.listen(3000);
console.log("Server listening on Port 3000 | http://localhost:3000/");