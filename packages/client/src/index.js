import MainLoop from 'mainloop.js';
import 'aframe';

import { EVENTS } from 'config';
import { $, connect, waitFor } from './utilities';
import World from './World';

const scene = $('a-scene');
(async () => {
  const connection = await connect('/socket');
  const { borderZ } = await waitFor(EVENTS.WORLD_CREATE);
  const world = new World(borderZ);

  connection.on(EVENTS.CHUNK_CREATE, chunk => world.addChunk(chunk));

  MainLoop.setUpdate((delta) => {
    world.update(delta);
  });
  MainLoop.setDraw(() => {
    world.draw(scene);
  });
  MainLoop.start();
})();
