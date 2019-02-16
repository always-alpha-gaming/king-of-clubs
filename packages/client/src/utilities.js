import io from 'socket.io-client';
import EventEmitter from 'eventemitter3';

class SocketWrapper extends EventEmitter {
  constructor(socket) {
    super();
    socket.on('event', ({ t, d }) => this.emit(t, d));
  }
}

function connect(...stuff) {
  return new Promise((resolve, reject) => {
    const socket = io(...stuff);
    socket.on('connect', () => resolve(new SocketWrapper(socket)));
    socket.on('connect_error', reject);
    socket.on('connect_timeout', reject);
    socket.on('error', reject);
  });
}

function waitFor(socket, event) {
  return new Promise((resolve, reject) => {
    socket.on('event', ({ t, d }) => {
      if (t === event) {
        resolve(d);
      }
    });
    socket.on('error', reject);
  });
}

const $ = document.querySelector.bind(document);

function createElement(type, props) {
  const thing = document.createElement(type);
  Object.entries(props)
    .forEach(([key, value]) => thing.setAttribute(key, value));
  return thing;
}

module.exports = {
  $,
  createElement,
  connect,
  waitFor,
};
