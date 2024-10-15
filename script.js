"use strict";

// Constants
const CANVAS = document.getElementById('canvas');
const CTX = CANVAS.getContext('2d');
const CANVAS_SIZE = {
  x: 500,
  y: 500
}
const SIMULATE_BUTTON = document.getElementById('simulate-button');
const SIMULATION_TIME_SPAN = document.getElementById('simulation-time');

// Classes
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }
}

// Variables
let gravity = null;
let stopTime = null;
let gameStartFrame = null;

/* DOCUMENTACIÓN!!! (En español, luego la traduciré supongo)

frame() es como interactuará con el entorno en cada frame (gravedad, fuerzas, etc)
draw() es el código que lo dibujará cada frame
*/
// Objects
class Player {
  constructor(initialX, initialY, sizeX, sizeY) {
    this.position = new Vector(initialX, initialY);
    this.hSpeed = 0;
    this.vSpeed = 0;
    this.size = { x: sizeX, y: sizeY }; // todo can size be a vector too? it would be interesting
  }
  frame() {
    // Gravity action
    this.hSpeed += gravity.x;
    this.vSpeed += gravity.y;
    // Movement
    this.position.add({ x: this.hSpeed, y: this.vSpeed });
  }
  draw() {
    CTX.fillStyle = 'red';
    CTX.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
  }
  reset() {
    this.position = new Vector(0, 0);
    this.hSpeed = 0;
    this.vSpeed = 0;
  }
}

const PLAYER = new Player(0, 0, 32, 32); // todo this is not goingo to be ere

// General functions
function gameStart() {
  // Get value from inputs
  const gravityXVal = parseFloat(document.getElementById('gravity-x').value);
  const gravityYVal = parseFloat(document.getElementById('gravity-y').value);
  const stopTimeVal = parseFloat(document.getElementById('stop-time').value);
  // Check if any of the values is invalid
  if (isNaN(gravityXVal) || isNaN(gravityYVal)) return 'Invalid gravity number';
  if (isNaN(stopTimeVal)) return 'Invalid stop time number';
  // Set values
  gravity = new Vector(gravityXVal, gravityYVal);
  stopTime = stopTimeVal * 1000;
  // Initialize events
  setCanvasDimensions(CANVAS_SIZE.x, CANVAS_SIZE.y);
  requestAnimationFrame(step);
}
function gameStop() {
  gameStartFrame = null;
  PLAYER.reset();
}
function step(timestamp) {
  if (gameStartFrame === null) {
    gameStartFrame = timestamp;
  }
  const elapsed = timestamp - gameStartFrame;

  clearCanvas();
  SIMULATION_TIME_SPAN.innerHTML = Math.min(Math.floor(elapsed) / 1000, stopTime / 1000);

  PLAYER.frame(); // en un futuro haré que haya un array de objects a los que se le llamen estas dos funciones
  PLAYER.draw();

  if (elapsed < stopTime) {
    requestAnimationFrame(step);
  } else {
    gameStop();
  }
}

// Canvas functions
function setCanvasDimensions(x, y) {
  CANVAS.width = x;
  CANVAS.height = y;
  CANVAS.style.width = y;
  CANVAS.style.height = y;
}
function clearCanvas() {
  CTX.clearRect(0, 0, CANVAS_SIZE.x, CANVAS_SIZE.y);
}

// Start game
SIMULATE_BUTTON.addEventListener('click', () => {
  const message = gameStart();
  if (message !== undefined) window.alert(message);
});