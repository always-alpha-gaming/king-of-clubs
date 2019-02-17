const io = require('socket.io')();
const ServerMapData = require('./ServerMapData');
const map = new ServerMapData({});

io.on('connection', client => {

  client.emit(JSON.stringify({t: 0, d: map}), () => {
    
  })

});
io.listen(3000);
