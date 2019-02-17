const MainLoop = require('mainloop.js');
const gameState = require('./Models/GameState');

/**
 * Begins the MainLoop
 */
function beginMainLoop() {
    MainLoop.setUpdate(update);
    MainLoop.start();
}

/**
 * The Update Function of our Game Loop
 * @param {number} deltaTime The Delta Time between Frames 
 */
function update(deltaTime) {

};

module.exports = beginMainLoop;