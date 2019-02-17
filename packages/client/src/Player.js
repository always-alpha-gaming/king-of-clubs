import { PlayerData } from 'game-objects';

import { createElement } from './utilities';

export default class Player extends PlayerData {
  setRef(entity) {
    this.ref = entity;
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
