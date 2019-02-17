import MainLoop from 'mainloop.js';
import { registerComponent } from 'aframe';
import { PlayerData } from 'game-objects';
import '../lib/LegacyJSONLoader';
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
    (/^\d+\.\d+\.\d+\.\d+$/.test(window.location.hostname)
      || window.location.hostname === 'localhost')
      ? `http://${window.location.hostname}:3000`
      : '/',
  );

  // world instance, contains all chunks and blocks
  const world = new World();
  // all players within range, indexed by ID
  const players = [];

  // listen for events from the server
  connection.on(EVENTS.CHUNK_CREATE, chunk => world.addChunk(chunk));

  // wait for world and player information
  // TODO: loading screen
  const { borderZ, me } = await waitFor(connection.socket, EVENTS.WORLD_CREATE);
  world.borderZ = borderZ;

  // initialize current player
  const player = new MainPlayer({ ...me, socket: connection.socket });
  player.setRef(playerElement);
  player.setColor();
  player.setDimensions();
  player.setCameraHeight();
  player.reload();

  connection.on(EVENTS.PLAYER_ENTER_RANGE, (newPlayer) => {
    if (newPlayer.id === player.id) {
      const { health, position, rotation } = newPlayer;
      console.log(player.position, position);
      player.health = health;
      const { x, y, z } = position;
      player.position = position;
      player.ref.object3D.position.set(x, y, z);
      player.rotation = rotation;
      return;
    }
    players.push(new Player(newPlayer));
  });
  connection.on(EVENTS.FELL_OFF_WORLD, ({ position, rotation }) => {
    console.log('hullo', position, rotation);
    player.position = position;
    player.rotation = rotation;
    const { x, y, z } = position;
    const { x: rx, y: ry, z: rz } = rotation;
    player.ref.object3D.position.set(x, y, z);
    player.ref.object3D.rotation.set(rx, ry, rz);
  });
  connection.on(EVENTS.PLAYER_LEAVE_RANGE, ({ id }) => {
    const index = players.findIndex(p => p && p.id === id);
    if (index !== -1) {
      players[index].unmount();
      delete players[index];
    }
  });
  connection.on(EVENTS.WORLD_TICK, ({ players: newPlayers }) => {
    // console.log('world tick', players);
    newPlayers.forEach((newPlayer) => {
      if (newPlayer.id === player.id) {
        player.health = newPlayer.health;
        return;
      }
      const index = players.findIndex(p => p && p.id === newPlayer.id);
      if (index === -1) {
        players.push(new Player(newPlayer));
      } else {
        players[index] = Object.assign(players[index], newPlayer);
      }
    });
  });

  // Game Loop Fixed TimeStep
  const FIXED_TIME_STEP = 50;
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

    player.update(delta, world, scene);
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
