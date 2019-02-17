import MainLoop from 'mainloop.js';
import 'aframe';
import 'aframe-extras';

import { EVENTS, SKYBOX_COLOR, TEAMS } from 'config';
import {
  $,
  connect,
  createElement,
  waitFor,
} from './utilities';
import World from './World';
import Player from './Player';

async function go() {
  const scene = $('a-scene');
  const playerElement = $('#player');

  // Set the Skybox Color to the CONST
  const skybox = $('a-sky');
  skybox.setAttribute('color', SKYBOX_COLOR);

  // Start the Connection
  const connection = await connect(
    `${window.location}`.includes('localhost') ? 'http://localhost:3000' : '/',
  );
  // const { borderZ } = await waitFor(connection.socket, EVENTS.WORLD_CREATE.toString());
  const world = new World(); // borderZ);

  const player = new Player({
    id: 'hullo',
    position: [0, 20, 0],
    rotation: [0, 90, 0],
    team: TEAMS[0],
  });
  player.setRef(playerElement);
  player.setColor(player.team.color);

  connection.on(EVENTS.CHUNK_CREATE, chunk => world.addChunk(chunk));

  MainLoop.setUpdate((delta) => {
    player.update(delta);
    world.update(delta);
  });
  MainLoop.setDraw(() => {
    player.draw(scene);
    world.draw(scene);
  });
  MainLoop.start();
}

document.addEventListener('DOMContentLoaded', go);
