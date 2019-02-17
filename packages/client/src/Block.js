import { BLOCK_SIZE } from 'config';
import { BlockData } from 'game-objects';

import { createElement } from './utilities';

export default class Block extends BlockData {
  draw(scene, renderTop, renderBottom, renderLeft, renderRight, renderFront, renderBack) {
    if (!this.refTop && renderTop) {
      const [x, y, z] = this.position;
      this.refTop = createElement('a-plane', {
        height: BLOCK_SIZE,
        width: BLOCK_SIZE,
        material: 'shader: flat',
        color: 'purple' || this.color,
        rotation: '-90 0 0',
        position: { x, y: y + 0.5, z },
      });
      scene.appendChild(this.refTop);
    }

    if (!this.refBottom && renderBottom) {
      const [x, y, z] = this.position;
      this.refBottom = createElement('a-plane', {
        height: BLOCK_SIZE,
        width: BLOCK_SIZE,
        material: 'shader: flat',
        color: 'yellow' || this.color,
        rotation: '90 0 0',
        position: { x, y: y - 0.5, z },
      });
      scene.appendChild(this.refBottom);
    }

    if (!this.refRight && renderRight) {
      const [x, y, z] = this.position;
      this.refRight = createElement('a-plane', {
        height: BLOCK_SIZE,
        width: BLOCK_SIZE,
        material: 'shader: flat',
        color: 'orange' || this.color,
        rotation: '0 -90 0',
        position: { x: x - 0.5, y, z },
      });
      scene.appendChild(this.refRight);
    }

    if (!this.refLeft && renderLeft) {
      const [x, y, z] = this.position;
      this.refLeft = createElement('a-plane', {
        height: BLOCK_SIZE,
        width: BLOCK_SIZE,
        material: 'shader: flat',
        color: 'blue' || this.color,
        rotation: '0 90 0',
        position: { x: x + 0.5, y, z },
      });
      scene.appendChild(this.refLeft);
    }

    if (!this.refBack && renderBack) {
      const [x, y, z] = this.position;
      this.refBack = createElement('a-plane', {
        height: BLOCK_SIZE,
        width: BLOCK_SIZE,
        material: 'shader: flat',
        color: 'red' || this.color,
        rotation: '0 0 0',
        position: { x, y, z: z + 0.5 },
      });
      scene.appendChild(this.refBack);
    }

    if (!this.refFront && renderFront) {
      const [x, y, z] = this.position;
      this.refFront = createElement('a-plane', {
        height: BLOCK_SIZE,
        width: BLOCK_SIZE,
        material: 'shader: flat',
        color: 'green' || this.color,
        rotation: '0 180 0',
        position: { x, y, z: z - 0.5 },
      });
      scene.appendChild(this.refFront);
    }


    /* if (!this.ref) {

      const [x, y, z] = this.position;
      this.ref = createElement('a-box', {
        color: this.color,
        position: { x, y, z },
      });
      scene.appendChild(this.ref);
    } */
  }
}
