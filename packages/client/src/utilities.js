import io from 'socket.io-client';
import EventEmitter from 'eventemitter3';

class SocketWrapper extends EventEmitter {
  constructor(socket) {
    super();
    this.socket = socket;
    socket.on('event', ({ t, d }) => {
      console.log(d, t);
      this.emit(t.toString(), d);
    });
  }
}

function connect(url, options) {
  return new Promise((resolve, reject) => {
    const socket = io(url, options);
    socket.on('connect', () => resolve(new SocketWrapper(socket)));
    socket.on('connect', () => console.log('test'));
    socket.on('connect_error', reject);
    socket.on('connect_timeout', reject);
    socket.on('event', console.log);
    socket.on('error', reject);
  });
}

function waitFor(socket, event) {
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
