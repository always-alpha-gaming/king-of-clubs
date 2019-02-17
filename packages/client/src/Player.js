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
    console.log(deltaV, velocity.y);

    const { x, y, z } = this.ref.object3D.position;
    // collisions
    const floor = world.getBlock(Math.floor(x), Math.floor(y) - 1, Math.floor(z));
    if (floor !== undefined || y <= 0) {
      velocity.y = 0;
    }

    // apply velocity
    this.ref.object3D.position.add(
      new Vector3(velocity.x * dt, velocity.y, velocity.z * dt),
    );
    velocity.x = 0;
    velocity.z = 0;
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
