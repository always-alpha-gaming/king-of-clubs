const MainLoop = require('mainloop.js');

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