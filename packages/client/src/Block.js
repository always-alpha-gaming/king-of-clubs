import { BLOCK_SIZE } from 'config';
import { BlockData } from 'game-objects';
import 'three';

const planeTopGeometry = new THREE.PlaneBufferGeometry(BLOCK_SIZE, BLOCK_SIZE);
planeTopGeometry.rotateX(-Math.PI / 2);
planeTopGeometry.translate(0, 0.5, 0);

const planeBottomGeometry = new THREE.PlaneBufferGeometry(BLOCK_SIZE, BLOCK_SIZE);
planeBottomGeometry.rotateX(-Math.PI / 2);
planeBottomGeometry.translate(0, -0.5, 0);

const planeRightGeometry = new THREE.PlaneBufferGeometry(BLOCK_SIZE, BLOCK_SIZE);
planeRightGeometry.rotateY(-Math.PI / 2);
planeRightGeometry.translate(-0.5, 0, 0);

const planeLeftGeometry = new THREE.PlaneBufferGeometry(BLOCK_SIZE, BLOCK_SIZE);
planeLeftGeometry.rotateY(Math.PI / 2);
planeLeftGeometry.translate(0.5, 0, 0);

const planeBackGeometry = new THREE.PlaneBufferGeometry(BLOCK_SIZE, BLOCK_SIZE);
planeBackGeometry.translate(0, 0, 0.5);

const planeFrontGeometry = new THREE.PlaneBufferGeometry(BLOCK_SIZE, BLOCK_SIZE);
planeFrontGeometry.rotateY(Math.PI);
planeFrontGeometry.translate(0, 0, -0.5);

export default class Block extends BlockData {
  render(renderTop, renderBottom, renderLeft, renderRight, renderFront, renderBack) {
    if (this.blockType === 0 || this.blockType === 1) {
      return [];
    }

    const geometries = [];

    const [x, y, z] = this.position;

    const matrix = new THREE.Matrix4();

    matrix.makeTranslation(
      x,
      y,
      z,
    );

    if (!this.refTop && renderTop) {
      geometries.push(planeTopGeometry.clone().applyMatrix(matrix));
    }

    if (!this.refBottom && renderBottom) {
      geometries.push(planeBottomGeometry.clone().applyMatrix(matrix));
    }

    if (!this.refRight && renderRight) {
      geometries.push(planeRightGeometry.clone().applyMatrix(matrix));
    }

    if (!this.refLeft && renderLeft) {
      geometries.push(planeLeftGeometry.clone().applyMatrix(matrix));
    }

    if (!this.refBack && renderBack) {
      geometries.push(planeBackGeometry.clone().applyMatrix(matrix));
    }

    if (!this.refFront && renderFront) {
      geometries.push(planeFrontGeometry.clone().applyMatrix(matrix));
    }

    return geometries;
  }
}
