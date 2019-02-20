import { PlayerData } from 'game-objects';
import { PLAYER } from 'config';

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

  update(delta) {
    if (this.ref) {
      // Convert the Position and Directions to Vectors
      const currentPosition = new Vector3(this.position.x, this.position.y, this.position.z);
      const movementDirection = new Vector3(this.movementDirection.x, this.movementDirection.y, this.movementDirection.z);

      // Move the networked player in the direction they were moving as of their Server Tick
      const movementDelta = new Vector3(movementDirection.x * 0 * delta, movementDirection.y * 0 * delta, movementDirection.z * 0 * delta);

      const newPosition = new Vector3();
      newPosition.addVectors(currentPosition, movementDelta);

      // Set the Position Attribute to the newly calculated position
      this.ref.setAttribute('position', newPosition);

      // Save the Position Back to the player for the next loop
      this.position = { x: newPosition.x, y: newPosition.y, z: newPosition.z };
    }
  }

  draw(scene) {
    if (!this.ref) {
      this.ref = createElement('a-box', {
        color: this.team.color,
        position: this.position,
        width: PLAYER.BASE_SIZE,
        depth: PLAYER.BASE_SIZE,
        height: PLAYER.HEIGHT,
      });
      this.ref.dataset.userId = this.id;
      scene.appendChild(this.ref);
      // this.ref.setAttribute('velocity', new Vector3());
    }
  }

  unmount() {
    if (this.ref && this.ref.object3D) {
      this.ref.parentEl.remove(this.ref);
    }
  }
}
