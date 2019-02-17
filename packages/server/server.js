const { EVENTS } = require('config');
const io = require('socket.io')();
const ServerMapData = require('./ServerMapData');
const map = new ServerMapData({});

io.on('connection', client => {
  console.log('connection from client');
  client.emit('event', {t: EVENTS.WORLD_CREATE, d: map});

  map.getOrGenChunk(0, 0);
  map.getOrGenChunk(1, 1);
  map.blockChunks.forEach(row => {
    row.forEach(chunk => {
      client.emit('event', {t: EVENTS.CHUNK_CREATE, d: chunk})
    })
  })

});
io.listen(3000);
