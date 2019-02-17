const ServerMapData = require('./ServerMapData');

class GameState {
    constructor() {
        this.map = new ServerMapData({});
    }
}

// Export an instance of the class
const instance = new GameState();
module.exports = instance;