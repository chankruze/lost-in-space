// constants
const PARTICLE_COUNT = 500;
const PARTICLE_BASE_RADIUS = 0.5;
const FL = 500;
// speed
const DEFAULT_SPEED = 2;
const BOOST_FACTOR = 150;
const BOOSTED_SPEED = DEFAULT_SPEED * BOOST_FACTOR;

// variables
let canvas;
let canvasWidth, canvasHeight;
let context;
let centerX, centerY;
let mouseX, mouseY;
let speed = DEFAULT_SPEED;
let targetSpeed = DEFAULT_SPEED;
let particles = [];

// data structures
class Particle {
  constructor(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.pastZ = 0;
  }

  randomize = () => {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.z = Math.random() * 1500 + 500;
  };
}

// helper functions

const resizeHandler = () => {
  canvasWidth = canvas.width = window.innerWidth;
  canvasHeight = canvas.height = window.innerHeight;
  centerX = canvasWidth * 0.5;
  centerY = canvasHeight * 0.5;
  context = canvas.getContext("2d");
  context.fillStyle = "rgb(255, 255, 255)";
};

const loop = () => {
  context.save();
  context.fillStyle = "rgb(0, 0, 0)";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  context.restore();

  speed += (targetSpeed - speed) * 0.01;

  let particle;
  let cx, cy;
  let rx, ry;
  let f, x, y, r;
  let pf, px, py, pr;
  let a, a1, a2;

  context.beginPath();

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particle = particles[i];

    particle.pastZ = particle.z;
    particle.z -= speed;

    if (particle.z <= 0) {
      particle.randomize();
      continue;
    }

    cx = centerX - (mouseX - centerX) * 1.25;
    cy = centerY - (mouseY - centerY) * 1.25;

    rx = particle.x - cx;
    ry = particle.y - cy;

    f = FL / particle.z;
    x = cx + rx * f;
    y = cy + ry * f;
    r = PARTICLE_BASE_RADIUS * f;

    pf = FL / particle.pastZ;
    px = cx + rx * pf;
    py = cy + ry * pf;
    pr = PARTICLE_BASE_RADIUS * pf;

    a = Math.atan2(py - y, px - x);
    a1 = a + Math.PI * 0.5;
    a2 = a - Math.PI * 0.5;

    context.moveTo(px + pr * Math.cos(a1), py + pr * Math.sin(a1));
    context.arc(px, py, pr, a1, a2, true);
    context.lineTo(x + r * Math.cos(a2), y + r * Math.sin(a2));
    context.arc(x, y, r, a2, a1, true);
    context.closePath();
  }

  context.fill();
};

const animate = () => {
  loop();
  requestAnimationFrame(animate);
};

/**
 * main entry point
 */

window.addEventListener("load", () => {
  canvas = document.querySelector("canvas");

  document.addEventListener("resize", resizeHandler);

  resizeHandler();

  mouseX = centerX;
  mouseY = centerY;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = new Particle();
    particle.randomize();
    particles[i] = particle;
    particles[i].z -= 500 * Math.random();
  }

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener("mousedown", (e) => {
    // TODO: accelerate
    targetSpeed = BOOSTED_SPEED;
  });

  document.addEventListener("mouseup", (e) => {
    // TODO: de-accelerate
    targetSpeed = DEFAULT_SPEED;
  });

  animate();
});
