const CONFIG = require('config');
const MainLoop = require('mainloop.js');
const clientManager = require('./Managers/ClientManager');
const gameState = require('./Models/GameState');

// Game Loop Fixed TimeStep
const FIXED_TIME_STEP = CONFIG.NETWORK.SERVER_TICK;
let currentTimeStep = 0;

function preformServerNetworkTick() {
  // Now that we are updating on a fixed interval, begin the Server-Side GameLoop
  const allPlayerData = gameState.getAllPlayerData();

  // Check if any players are dead...
  allPlayerData.forEach((player) => {
    // If players are dead...
    if (player.health === -999) {
      // Reset the Health and broadcast they are alive
      player.health = CONFIG.PLAYER.MAX_HEALTH;
      clientManager.broadcastMessage(CONFIG.EVENTS.PLAYER_ENTER_RANGE, player);
    }
  })

  // Tick out the Global Game State
  const worldTickData = {
    players: allPlayerData,
  };
  clientManager.broadcastMessage(CONFIG.EVENTS.WORLD_TICK, worldTickData);
}

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
  // If we haven't passsed the FIXED_TIME_STEP, then skip the tick
  // When we have, subtract the FIXED_TIME_STEP from the currentTimeStep and preform tick
  currentTimeStep += deltaTime;
  if (currentTimeStep >= FIXED_TIME_STEP) {
    currentTimeStep -= FIXED_TIME_STEP;
    preformServerNetworkTick();
  }

  // Continue the Server Game Loop
  // TODO: Add Server Processing
}

module.exports = beginMainLoop;
