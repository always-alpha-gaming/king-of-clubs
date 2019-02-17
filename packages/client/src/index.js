import MainLoop from 'mainloop.js';
import { registerComponent } from 'aframe';
import 'aframe-extras';
import './Chunk';

import {
  EVENTS,
  SKYBOX_COLOR,
  TEAMS,
  PLAYER,
} from 'config';
import {
  $,
  connect,
  createElement,
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


  // Set the Skybox Color to the CONST
  // const skybox = $('a-sky');
  // skybox.color = SKYBOX_COLOR;

  const body = $('body');
  body.style.backgroundColor = SKYBOX_COLOR;

  // Start the Connection
  const connection = await connect(
    `${window.location}`.includes('localhost') ? 'http://localhost:3000' : '/',
  );
  // const { borderZ } = await waitFor(connection.socket, EVENTS.WORLD_CREATE.toString());
  const world = new World();

  const player = new Player({
    id: 'hullo',
    position: [0, 50, 0],
    rotation: [0, 90, 0],
    teamIndex: 0,
  });
  player.setRef(playerElement);
  player.setColor();
  player.setDimensions();
  player.setCameraHeight();
  // player.initializeVelocity();

  connection.on(EVENTS.CHUNK_CREATE, chunk => world.addChunk(chunk));

  MainLoop.setUpdate((delta) => {
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
