import { BLOCK_SIZE } from 'config';
import { BlockData } from 'game-objects';
import 'three';

const planeTopGeometry = new THREE.PlaneBufferGeometry(BLOCK_SIZE, BLOCK_SIZE);
planeTopGeometry.rotateX(-Math.PI / 2);
planeTopGeometry.translate(0.5, 1, 0.5);

const planeBottomGeometry = new THREE.PlaneBufferGeometry(BLOCK_SIZE, BLOCK_SIZE);
planeBottomGeometry.rotateX(Math.PI / 2);
planeBottomGeometry.translate(0.5, 0, 0.5);

const planeRightGeometry = new THREE.PlaneBufferGeometry(BLOCK_SIZE, BLOCK_SIZE);
planeRightGeometry.rotateY(-Math.PI / 2);
planeRightGeometry.translate(0, 0.5, 0.5);

const planeLeftGeometry = new THREE.PlaneBufferGeometry(BLOCK_SIZE, BLOCK_SIZE);
planeLeftGeometry.rotateY(Math.PI / 2);
planeLeftGeometry.translate(1, 0.5, 0.5);

const planeBackGeometry = new THREE.PlaneBufferGeometry(BLOCK_SIZE, BLOCK_SIZE);
planeBackGeometry.translate(0.5, 0.5, 1);

const planeFrontGeometry = new THREE.PlaneBufferGeometry(BLOCK_SIZE, BLOCK_SIZE);
planeFrontGeometry.rotateY(Math.PI);
planeFrontGeometry.translate(0.5, 0.5, 0);

export default class Block extends BlockData {
  static render(block, position, renderTop, renderBottom, renderLeft, renderRight, renderFront, renderBack) {
    const blockType = Block.getBlockType(block);
    if (blockType.transparent) {
      return [];
    }

    const geometries = [];

    const [x, y, z] = position;

    const matrix = new THREE.Matrix4();

    matrix.makeTranslation(
      x,
      y,
      z,
    );

    if (renderTop) {
      geometries.push(planeTopGeometry.clone().applyMatrix(matrix));
    }

    if (renderBottom) {
      geometries.push(planeBottomGeometry.clone().applyMatrix(matrix));
    }

    if (renderRight) {
      geometries.push(planeRightGeometry.clone().applyMatrix(matrix));
    }

    if (renderLeft) {
      geometries.push(planeLeftGeometry.clone().applyMatrix(matrix));
    }

    if (renderBack) {
      geometries.push(planeBackGeometry.clone().applyMatrix(matrix));
    }

    if (renderFront) {
      geometries.push(planeFrontGeometry.clone().applyMatrix(matrix));
    }

    return geometries;
  }
}
