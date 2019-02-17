import { PlayerData } from 'game-objects';
import { PLAYER } from 'config';

import { createElement } from './utilities';

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

  draw(scene) {
    if (!this.ref) {
      this.ref = createElement('a-sphere', {
        color: this.team.color,
      });
      scene.appendChild(this.ref);
    }
  }
}
