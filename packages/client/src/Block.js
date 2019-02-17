import { BlockData } from 'game-objects';

import { createElement } from './utilities';

let count = 0;

export default class Block extends BlockData {
  draw(scene) {
    if (!this.ref) {
      const [x, y, z] = this.position;
      if (y < 64) {
        this.ref = true;
        if (Math.random() < 0.999) return;
      }
      count++;
      console.log(count);
      this.ref = createElement('a-box', {
        color: this.color || 'green',
        position: { x, y, z },
      });
      scene.appendChild(this.ref);
    }
  }
}
