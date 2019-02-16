import { BlockData } from 'game-objects';

import { createElement } from './utilities';

export default class Block extends BlockData {
  draw(scene) {
    if (!this.ref) {
      const [x, y, z] = this.position;
      this.ref = createElement('a-box', {
        color: this.colour,
        position: { x, y, z },
      });
      scene.appendChild(this.ref);
    }
  }
}
