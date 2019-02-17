import { PlayerData } from 'game-objects';
import { PLAYER, WORLD_GRAVITY } from 'config';

import { createElement } from './utilities';

const { Vector3 } = THREE;

export default class Player extends PlayerData {
  setRef(entity) {
    this.ref = entity;
  }

  setColor(color = this.team.color) {
    this.ref.setAttribute('color', color);
  }

  setDimensions(width = PLAYER.BASE_SIZE, height = PLAYER.HEIGHT, depth = PLAYER.BASE_SIZE) {
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.ref.setAttribute('geometry', 'width', width);
    this.ref.setAttribute('geometry', 'height', height);
    this.ref.setAttribute('geometry', 'depth', depth);
  }

  setCameraHeight(height = PLAYER.CAMERA_HEIGHT) {
    this.ref.querySelector('[camera]').setAttribute('position', 'y', height);
  }

  initializeVelocity() {
    this.ref.setAttribute('velocity', new Vector3());
  }

  update(delta, world) {
    const velocity = this.ref.getAttribute('velocity');
    if (velocity === null || typeof velocity === 'string') {
      return;
    }

    const dt = delta / 1000;

    // apply gravity
    const deltaV = WORLD_GRAVITY * dt;
    velocity.y -= deltaV;
    let collisionArray = [];
    const { x, y, z } = this.ref.object3D.position;
    // collisions
    const floor = world.getBlock(Math.floor(x), Math.floor(y) - 1, Math.floor(z));
    if ((floor !== undefined && floor !== null) || y <= 0) {
      velocity.y = 0;
    }
    if (velocity.x > 0) {
      collisionArray.push(world.getBlock(Math.floor(x) + 1, Math.floor(y), Math.round(z)));
      collisionArray.push(world.getBlock(Math.floor(x) + 1, Math.floor(y) + 1, Math.round(z)));
      collisionArray.push(world.getBlock(Math.floor(x) + 1, Math.floor(y) + 2, Math.round(z)));
      const filteredCollisions = collisionArray.filter(element => element !== null);
      if (filteredCollisions.length !== 0) {
        console.log('xp');
        velocity.x = 0;
        collisionArray = [];
      }
    }

    if (velocity.x < 0) {
      collisionArray.push(world.getBlock(Math.ceil(x) - 1, Math.floor(y), Math.round(z)));
      collisionArray.push(world.getBlock(Math.ceil(x) - 1, Math.floor(y) + 1, Math.round(z)));
      collisionArray.push(world.getBlock(Math.ceil(x) - 1, Math.floor(y) + 2, Math.round(z)));
      const filteredCollisions = collisionArray.filter(element => element !== null);
      if (filteredCollisions.length !== 0) {
        velocity.x = 0;
        console.log('xn');
        collisionArray = [];
      }
    }

    if (velocity.z > 0) {
      collisionArray.push(world.getBlock(Math.round(x), Math.floor(y), Math.floor(z) + 1));
      collisionArray.push(world.getBlock(Math.round(x), Math.floor(y) + 1, Math.floor(z) + 1));
      collisionArray.push(world.getBlock(Math.round(x), Math.floor(y) + 2, Math.floor(z) + 1));
      const filteredCollisions = collisionArray.filter(element => element !== null);
      if (filteredCollisions.length !== 0) {
        console.log('zp');
        velocity.z = 0;
        collisionArray = [];
      }
    }

    if (velocity.z < 0) {
      collisionArray.push(world.getBlock(Math.round(x), Math.floor(y), Math.ceil(z) - 1));
      collisionArray.push(world.getBlock(Math.round(x), Math.floor(y) + 1, Math.ceil(z) - 1));
      collisionArray.push(world.getBlock(Math.round(x), Math.floor(y) + 2, Math.ceil(z) - 1));
      const filteredCollisions = collisionArray.filter(element => element !== null);
      if (filteredCollisions.length !== 0) {
        console.log('zn');
        velocity.z = 0;
        collisionArray = [];
      }
    }

    // apply velocity
    this.ref.object3D.position.add(
      new Vector3(velocity.x * dt, velocity.y, velocity.z * dt),
    );
    const { position, rotation } = this.ref.object3D;
    this.position = [position.x, position.y, position.z];
    this.rotation = [rotation.x, rotation.y, rotation.z];
  }

  draw(scene) {
    if (!this.ref) {
      this.ref = createElement('a-sphere', {
        color: this.team.color,
      });
      scene.appendChild(this.ref);
      // this.ref.setAttribute('velocity', new Vector3());
    }
  }
}
