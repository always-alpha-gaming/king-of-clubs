import MainLoop from 'mainloop.js';
import { registerComponent } from 'aframe';
import { PlayerData } from 'game-objects';
import 'aframe-extras';
import './Chunk';

import {
  EVENTS,
  SKYBOX_COLOR,
} from 'config';
import {
  $,
  connect,
  waitFor,
} from './utilities';
import World from './World';
import Player from './Player';

registerComponent('velocity', {
  schema: { type: 'vec3', default: new THREE.Vector3() },
});

async function go() {
  const scene = $('a-scene');
  const playerElement = $('#player');

  const body = $('body');
  body.style.backgroundColor = SKYBOX_COLOR;

  // Start the Connection
  const connection = await connect(
    `${window.location}`.includes('localhost') ? 'http://localhost:3000' : '/',
  );
  const { borderZ, me } = await waitFor(connection.socket, EVENTS.WORLD_CREATE);
  const world = new World(borderZ);

  const player = new Player(me);
  player.setRef(playerElement);
  player.setColor();
  player.setDimensions();
  player.setCameraHeight();

  connection.on(EVENTS.CHUNK_CREATE, chunk => world.addChunk(chunk));

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
    world.update(delta);
  });
  MainLoop.setDraw(() => {
    player.draw(scene);
    world.draw(scene);
  });
  MainLoop.start();
}

document.addEventListener('DOMContentLoaded', go);
