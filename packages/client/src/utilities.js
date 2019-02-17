import io from 'socket.io-client';
import EventEmitter from 'eventemitter3';

export class SocketWrapper extends EventEmitter {
  constructor(socket) {
    super();
    this.socket = socket;
    socket.on('event', ({ t, d }) => {
      this.emit(t.toString(), d);
    });
  }
}

export function connect(url, options) {
  return new Promise((resolve, reject) => {
    const socket = io(url, options);
    socket.on('connect', () => resolve(new SocketWrapper(socket)));
    socket.on('connect_error', reject);
    socket.on('connect_timeout', reject);
    socket.on('error', reject);
  });
}

export function waitFor(socket, event) {
  return new Promise((resolve, reject) => {
    const waiter = ({ t, d }) => {
      if (t === event) {
        resolve(d);
      }
      socket.removeEventListener('event', waiter);
    };
    socket.on('event', waiter);
    socket.on('error', reject);
  });
}

export function collidingAxes(a, b) {
  const axes = [];

  const ax = a.position.x;
  const bx = b.position.x;
  const ay = a.position.y;
  const by = b.position.y;
  const az = a.position.z;
  const bz = b.position.z;
  if (ax < bx + b.width && ax + a.width > bx) {
    axes.push('x');
  }
  if (ay < by + b.height && ay + a.height > by) {
    axes.push('y');
  }
  if (az < bz + b.depth && az + a.depth > bz) {
    axes.push('z');
  }
  return axes;
}

export const $ = document.querySelector.bind(document);

export function createElement(type, props, ...children) {
  const thing = document.createElement(type);
  Object.entries(props)
    .forEach(([key, value]) => thing.setAttribute(key, value));
  children.forEach(child => thing.appendChild(child));
  return thing;
}
