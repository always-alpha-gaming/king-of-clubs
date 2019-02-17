const ServerMapData = require('./ServerMapData');

class GameState {
    constructor() {
        this.map = new ServerMapData({});

        // Initialize the map with some chunks
        this.map.getOrGenChunk(0, 0);
        this.map.getOrGenChunk(1, 1);
        this.map.getOrGenChunk(0, 1);
        this.map.getOrGenChunk(1, 0);
    }
}

// Export an instance of the class
const instance = new GameState();
module.exports = instance;