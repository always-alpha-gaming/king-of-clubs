import { WORLD_GRAVITY, EVENTS, PLAYER } from 'config';
import Player from './Player';
import { $ } from './utilities';

const { Vector3 } = THREE;

export default class MainPlayer extends Player {
  constructor({ socket, ...rest }) {
    super(rest);
    this.socket = socket;
    this.healthSpan = $('#health');
  }

  reload() {
    if (!this.canShoot) {
      this.canShoot = true;
    }
    window.addEventListener('click', (evt) => {
      if (this.canShoot) {
        if (!evt.detail.intersectedEl) {
          return;
        }
        console.log('Shooting at:', evt.detail.intersectedEl.dataset.userId);
        this.socket.emit(EVENTS.PLAYER_SHOOT, {
          targetID: Number.parseInt(evt.detail.intersectedEl.dataset.userId, 10),
        });
        this.canShoot = false;
        setTimeout(() => {
          this.canShoot = true;
        }, 1000);
      }
    });
  }

  blockDelete(world) {
    const destination = this.traceVisionToBlock(world);

    if (!destination) {
      return;
    }

    this.socket.emit(EVENTS.BLOCK_DELETE, {
      position: destination.block.position,
    });
  }

  traceVisionToBlock(world) {
    const camera = this.ref.querySelector('[camera]');

    const { position } = this.ref.object3D;

    const { position: cameraPosition } = camera.object3D;

    const { rotation } = camera.object3D;

    const direction = new THREE.Vector3(0, 0, -1).applyEuler(rotation)
      .normalize();

    const absolutePosition = position.clone().add(cameraPosition);

    return world.raycast(absolutePosition, direction, 5);
  }

  blockPlace(world) {
    const destination = this.traceVisionToBlock(world);

    if (!destination) {
      return;
    }

    const { face } = destination;

    this.socket.emit(EVENTS.BLOCK_PLACE, {
      position: [destination.x + face.x, destination.y + face.y, destination.z + face.z],
    });
  }

  update(delta, world, scene) {
    if (!this.ref) {
      return;
    }

    this.healthSpan.innerText = Array(PLAYER.MAX_HEALTH)
      .fill('💖', 0, this.health)
      .fill('🖤', this.health, PLAYER.MAX_HEALTH)
      .join(' ');

    const velocity = this.ref.getAttribute('velocity');
    let keyboardControls;
    if (!keyboardControls) {
      keyboardControls = this.ref.components['keyboard-controls'];
    }

    if (keyboardControls.isPressed('KeyE') !== this.placeBlockButton) {
      this.placeBlockButton = keyboardControls.isPressed('KeyE');

      if (this.placeBlockButton) {
        this.blockPlace(world);
      }
    }

    if (keyboardControls.isPressed('KeyQ') !== this.blockDeleteButton) {
      this.blockDeleteButton = keyboardControls.isPressed('KeyQ');

      if (this.blockDeleteButton) {
        this.blockDelete(world);
      }
    }

    if (keyboardControls.isPressed('Space')) {
      if (velocity.y === 0) {
        velocity.y = 0.075;
      }
    }

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
    const floorOne = world.getBlock(Math.floor(x - 0.4), Math.floor(y - 1.3), Math.floor(z - 0.4));
    const floorTwo = world.getBlock(Math.ceil(x - 0.4), Math.floor(y - 1.3), Math.floor(z - 0.4));
    const floorThree = world.getBlock(Math.floor(x - 0.4), Math.floor(y - 1.3), Math.ceil(z - 0.4));
    const floorFour = world.getBlock(Math.ceil(x - 0.4), Math.floor(y - 1.3), Math.ceil(z - 0.4));
    const onFloor = !(floorOne == null
      && floorTwo == null
      && floorThree == null
      && floorFour == null);

    if (onFloor && velocity.y <= 0) {
      velocity.y = 0;
    }


    if (velocity.x > 0) {
      collisionArray.push(world.getBlock(Math.floor(x - 0.4) + 1, Math.floor(y - 0.3), Math.round(z - 0.5)));
      collisionArray.push(world.getBlock(Math.floor(x - 0.4) + 1, Math.floor(y - 0.3) + 1, Math.round(z - 0.5)));
      collisionArray.push(world.getBlock(Math.floor(x - 0.4) + 1, Math.floor(y - 0.3) + 2, Math.round(z - 0.5)));
      const filteredCollisions = collisionArray.filter(element => element !== null);
      if (filteredCollisions.length !== 0) {
        velocity.x = 0;
        collisionArray = [];
      }
    }

    if (velocity.x < 0) {
      collisionArray.push(world.getBlock(Math.ceil(x - 0.4) - 1, Math.floor(y - 0.3), Math.round(z - 0.5)));
      collisionArray.push(world.getBlock(Math.ceil(x - 0.4) - 1, Math.floor(y - 0.3) + 1, Math.round(z - 0.5)));
      collisionArray.push(world.getBlock(Math.ceil(x - 0.4) - 1, Math.floor(y - 0.3) + 2, Math.round(z - 0.5)));
      const filteredCollisions = collisionArray.filter(element => element !== null);
      if (filteredCollisions.length !== 0) {
        velocity.x = 0;
        collisionArray = [];
      }
    }

    if (velocity.z > 0) {
      collisionArray.push(world.getBlock(Math.round(x - 0.4), Math.floor(y - 0.3), Math.floor(z - 0.5) + 1));
      collisionArray.push(world.getBlock(Math.round(x - 0.4), Math.floor(y - 0.3) + 1, Math.floor(z - 0.5) + 1));
      collisionArray.push(world.getBlock(Math.round(x - 0.4), Math.floor(y - 0.3) + 2, Math.floor(z - 0.5) + 1));
      const filteredCollisions = collisionArray.filter(element => element !== null);
      if (filteredCollisions.length !== 0) {
        velocity.z = 0;
        collisionArray = [];
      }
    }

    if (velocity.z < 0) {
      collisionArray.push(world.getBlock(Math.round(x - 0.4), Math.floor(y - 0.3), Math.ceil(z - 0.5) - 1));
      collisionArray.push(world.getBlock(Math.round(x - 0.4), Math.floor(y - 0.3) + 1, Math.ceil(z - 0.5) - 1));
      collisionArray.push(world.getBlock(Math.round(x - 0.4), Math.floor(y - 0.3) + 2, Math.ceil(z - 0.5) - 1));
      const filteredCollisions = collisionArray.filter(element => element !== null);
      if (filteredCollisions.length !== 0) {
        velocity.z = 0;
        collisionArray = [];
      }
    }

    // apply velocity
    this.ref.object3D.position.add(
      new Vector3(velocity.x * dt, velocity.y, velocity.z * dt),
    );
    const { position, rotation } = this.ref.object3D;
    velocity.x = 0;
    velocity.z = 0;

    const lastPosition = this.position; // Store the last known position so that we can do a Delta on it
    this.position = position;
    this.rotation = rotation;

    // Calculate the movementDirection
    const movementDirection = new Vector3();
    movementDirection.subVectors(this.position, lastPosition).normalize();
    this.movementDirection = movementDirection;

    // Emit FELL_OFF_WORLD if the player has Fallen off the World
    if (!this.fellOffWorld && this.position.y <= -10) {
      this.fellOffWorld = true;
      this.socket.emit(EVENTS.FELL_OFF_WORLD, {});
    } else if (this.fellOffWorld) {
      this.fellOffWorld = false;
    }
  }
}
