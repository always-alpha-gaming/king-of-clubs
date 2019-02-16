import MainLoop from 'mainloop.js';
import 'aframe';

const $ = document.querySelector.bind(document);

function newThing(type, props) {
  const thing = document.createElement(type);
  Object.entries(props)
    .forEach(([key, value]) => thing.setAttribute(key, value));
  return thing;
}


const box = newThing('a-box', {
  scale: '2 2 2',
  rotation: '0 45 45',
  position: '0 2 -5',
  color: 'orange',
});

$('a-scene').appendChild(box);

function makeRotator(degrees) {
  return function rotate(delta) {
    const amount = degrees * delta * 0.05;
    box.object3D.rotation.z += THREE.Math.degToRad(amount);
    box.object3D.rotation.x += THREE.Math.degToRad(amount);
    box.object3D.rotation.y += THREE.Math.degToRad(amount);
  };
}

MainLoop.setUpdate(makeRotator(1)).start();
