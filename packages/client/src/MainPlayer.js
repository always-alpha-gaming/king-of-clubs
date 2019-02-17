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
    const camera = this.ref.querySelector('[camera]');

    const { position } = this.ref.object3D;

    const { rotation } = camera.object3D;

    const direction = new THREE.Vector3(0, 0, -1).applyEuler(rotation).normalize();

    const destination = world.raycast(position, direction, 5);

    if (!destination) {
      return;
    }

    this.socket.emit(EVENTS.BLOCK_DELETE, {
      position: destination.block.position,
    });
  }

  blockPlace(world) {
    const camera = this.ref.querySelector('[camera]');

    const { position } = this.ref.object3D;

    const { rotation } = camera.object3D;

    const direction = new THREE.Vector3(0, 0, -1).applyEuler(rotation)
      .normalize();

    const destination = world.raycast(position, direction, 5);

    if (!destination) {
      return;
    }

    this.socket.emit(EVENTS.BLOCK_PLACE, {
      position: [destination.x, destination.y + 2, destination.z],
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

      if (keyboardControls.isPressed('Space')) {
        if (velocity.y === 0) {
          velocity.y = 0.075;
        }
      }

      if (velocity === null || typeof velocity === 'string') {
        return;
      }


      this.left = this.ref.querySelector('[vive-controls*="hand: left"]').components['grab'];
      this.right = this.ref.querySelector('[vive-controls*="hand: right"]').components['grab'];


      this.left.addEventListener('gripdown', () => {
        if (velocity.y === 0) {
          velocity.y = 0.075;
        }
      });

      this.left.addEventListener('trackpadup', this.blockPlace(world, scene));

      this.right.addEventListener('gripdown', () => {
        window.click();
      });

      const dt = delta / 1000;

      // apply gravity
      const deltaV = WORLD_GRAVITY * dt;
      velocity.y -= deltaV;
      let collisionArray = [];
      const { x, y, z } = this.ref.object3D.position;
      // collisions
      const floor = world.getBlock(Math.floor(x), Math.floor(y) - 1, Math.floor(z));
      if (floor !== undefined && floor !== null && velocity.y <= 0) {
        velocity.y = 0;
      }
      if (velocity.x > 0) {
        collisionArray.push(world.getBlock(Math.floor(x) + 1, Math.floor(y), Math.round(z)));
        collisionArray.push(world.getBlock(Math.floor(x) + 1, Math.floor(y) + 1, Math.round(z)));
        collisionArray.push(world.getBlock(Math.floor(x) + 1, Math.floor(y) + 2, Math.round(z)));
        const filteredCollisions = collisionArray.filter(element => element !== null);
        if (filteredCollisions.length !== 0) {
          velocity.x = 0;
          collisionArray = [];
        }
      }

      if (velocity.x < 0) {
        collisionArray.push(world.getBlock(Math.ceil(x) - 1, Math.floor(y), Math.round(z)));
        collisionArray.push(world.getBlock(Math.ceil(x) - 1, Math.floor(y) + 1, Math.round(z)));
        collisionArray.push(world.getBlock(Math.ceil(x) - 1, Math.floor(y) + 2, Math.round(z)));
        const filteredCollisions = collisionArray.filter(element => element !== null);
        if (filteredCollisions.length !== 0) {
          velocity.x = 0;
          collisionArray = [];
        }
      }

      if (velocity.z > 0) {
        collisionArray.push(world.getBlock(Math.round(x), Math.floor(y), Math.floor(z) + 1));
        collisionArray.push(world.getBlock(Math.round(x), Math.floor(y) + 1, Math.floor(z) + 1));
        collisionArray.push(world.getBlock(Math.round(x), Math.floor(y) + 2, Math.floor(z) + 1));
        const filteredCollisions = collisionArray.filter(element => element !== null);
        if (filteredCollisions.length !== 0) {
          velocity.z = 0;
          collisionArray = [];
        }
      }

      if (velocity.z < 0) {
        collisionArray.push(world.getBlock(Math.round(x), Math.floor(y), Math.ceil(z) - 1));
        collisionArray.push(world.getBlock(Math.round(x), Math.floor(y) + 1, Math.ceil(z) - 1));
        collisionArray.push(world.getBlock(Math.round(x), Math.floor(y) + 2, Math.ceil(z) - 1));
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

      this.position = position;
      this.rotation = rotation;

      if (!this.fellOffWorld && this.position.y <= -10) {
        this.fellOffWorld = true;
        this.socket.emit(EVENTS.FELL_OFF_WORLD, {});
      } else if (this.fellOffWorld) {
        this.fellOffWorld = false;
      }
    }
  }
}
