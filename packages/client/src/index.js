import MainLoop from 'mainloop.js';
import 'aframe';

import { EVENTS } from 'config';
import { $, connect, waitFor } from './utilities';
import World from './World';

async function go() {
  const scene = $('a-scene');
  const connection = await connect(
    `${window.location}`.includes('localhost') ? 'http://localhost:3000' : '/',
  );
  // const { borderZ } = await waitFor(connection.socket, EVENTS.WORLD_CREATE.toString());
  const world = new World(); //borderZ);

  connection.on(EVENTS.CHUNK_CREATE, chunk => world.addChunk(chunk));

  MainLoop.setUpdate((delta) => {
    world.update(delta);
  });
  MainLoop.setDraw(() => {
    world.draw(scene);
  });
  MainLoop.start();
}

document.addEventListener('DOMContentLoaded', go);
