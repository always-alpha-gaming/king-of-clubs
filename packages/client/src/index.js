import MainLoop from 'mainloop.js';
import { registerComponent } from 'aframe';
import { PlayerData } from 'game-objects';
import 'aframe-extras';
import './Chunk';

import { EVENTS, SKYBOX_COLOR } from 'config';
import { $, connect, waitFor } from './utilities';
import World from './World';
import Player from './Player';
import MainPlayer from './MainPlayer';

// custom velocity component
registerComponent('velocity', {
  schema: { type: 'vec3', default: new THREE.Vector3() },
});

async function go() {
  const body = $('body');
  body.style.backgroundColor = SKYBOX_COLOR;

  // important DOM elements
  const scene = $('a-scene');
  const playerElement = $('#player');

  // wait for the connection
  const connection = await connect(
    `http://${window.location.hostname}:3000`,
    // `${window.location}`.includes('localhost') ? 'http://localhost:3000' : '/',
  );

  // world instance, contains all chunks and blocks
  const world = new World();
  // all players within range, indexed by ID
  const players = {};

  // listen for events from the server
  connection.on(EVENTS.CHUNK_CREATE, chunk => world.addChunk(chunk));
  connection.on(EVENTS.PLAYER_ENTER_RANGE, (player) => {
    players[player.id] = new Player(player);
  });
  connection.on(EVENTS.PLAYER_LEAVE_RANGE, ({ id }) => {
    players[id].unmount();
    delete players[id];
  });
  connection.on(EVENTS.WORLD_TICK, ({ players: newPlayers }) => {
    newPlayers.forEach((player) => {
      if (!players[player.id]) {
        players[player.id] = new Player(player);
      } else {
        players[player.id] = Object.assign(players[player.id], player);
      }
    });
  });

  // wait for world and player information
  // TODO: loading screen
  const { borderZ, me } = await waitFor(connection.socket, EVENTS.WORLD_CREATE);
  world.borderZ = borderZ;

  // initialize current player
  const player = new MainPlayer(me);
  player.setRef(playerElement);
  player.setColor();
  player.setDimensions();
  player.setCameraHeight();

  // Game Loop Fixed TimeStep
  const FIXED_TIME_STEP = 100;
  let currentTimeStep = 0;
  MainLoop.setUpdate((delta) => {
    // Determine if a fixed amount of time has passed on our server before we continue our loop.
    // If we haven't passsed the FIXED_TIME_STEP, then leave the Update Loop
    // When we have, subtract the FIXED_TIME_STEP from the currentTimeStep
    currentTimeStep += delta;
    if (currentTimeStep >= FIXED_TIME_STEP) {
      currentTimeStep -= FIXED_TIME_STEP;
      connection.socket.emit(EVENTS.CLIENT_TICK, {
        me: new PlayerData(player),
      });
    }

    player.update(delta, world);
    Object.values(players).forEach(p => p.update(delta, world));
    world.update(delta);
  });
  MainLoop.setDraw(() => {
    player.draw(scene);
    Object.values(players).forEach(p => p.draw(scene));
    world.draw(scene);
  });
  MainLoop.start();
}

document.addEventListener('DOMContentLoaded', go);
