const CONFIG = require('config');
const MainLoop = require('mainloop.js');
const clientManager = require('./Managers/ClientManager');
const gameState = require('./Models/GameState');

// Game Loop Fixed TimeStep
const FIXED_TIME_STEP = 100;
let currentTimeStep = 0;

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
    // Determine if a fixed amount of time has passed on our server before we continue our loop.
    // If we haven't passsed the FIXED_TIME_STEP, then leave the Update Loop
    // When we have, subtract the FIXED_TIME_STEP from the currentTimeStep
    currentTimeStep += deltaTime;
    if (currentTimeStep < FIXED_TIME_STEP) return;
    currentTimeStep -= FIXED_TIME_STEP;

    // Now that we are updating on a fixed interval, begin the Server-Side GameLoop
};

module.exports = beginMainLoop;