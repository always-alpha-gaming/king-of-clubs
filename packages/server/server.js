const io = require('socket.io')();
io.on('connection', client => {

  client.emit('request', () => {
    
  })

});
io.listen(3000);
