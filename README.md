# King of Clubs

## Controls

It supports VR, Mobile and Mouse/Keyboard controls

### Mouse/Keyboard

* Look - Move Mouse
* Shoot - Left Mouse Click
* Move - WSAD
* Jump - Space Bar
* Break Block - Q
* Build Block - E

### Touch

* Look - Using the the accelerometer.
* Look - Tap and Swipe Around Screen
* Move Forward - Tap and Hold down Screen

### VR

* Look - Move your head around
* Move - Left Wand

## Inspiration

A long time ago some friends and I used to love a game called Ace of Spades, we wanted to re-create it for the web, allowing anyone on any platform to play together, without having to install anything.

## What it does

It's a Multiplayer First Person Shooter Game with a focus on a single massive border skirmish.

## How we built it

The Map is generated using a combination of 'THREE.js' and 'A-Frame'. Multiplayer is handled using 'Socket.IO'. Our game was made from scratch in 'Node.js'

We used THREE.js for the terrain rendering with higher level libraries like a-frame lacking the performance to render the geometry count we required for a realistic voxel terrain, perlin noise to generate the terrain, a-frame for the characters and character - character interaction. We used node.js for the server side, passing events on a websocket transport and running a self made game engine on the server to handle player interaction events such as shots fired and blocks placed.

## Challenges we ran into

Performance was a massive challenge, we had to re-write the voxel rendering code with a lower level api and merging meshes to create larger meshes in order to increase performance. In the end we managed to get a decent sized map into 14 or so draw calls and a couple thousand triangles, which runs at whatever monitor's framerate we threw at it. (including 165hz)

## What's next for King of Clubs

Implementation of the border, better phone controls and trying to organize large battles in it
