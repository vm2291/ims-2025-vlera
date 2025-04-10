/*
 https://p5js.org/examples/sound-mic-input.html and chatGPT help.
*/

let mic;
let button;
let circles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  mic = new p5.AudioIn();
  mic.start();

  button = createButton('Go Fullscreen');
  button.position(20, 20);
  button.style("font-size", "18px");
  button.mousePressed(() => {
    fullscreen(true);
    button.remove();
  });
}

function draw() {
  let vol = mic.getLevel();

  let r = map(vol, 0, 1, 100, 255);
  let g = map(vol, 0, 1, 150, 255);
  let b = map(vol, 0, 1, 200, 255);

  background(r, g, b, 80);

  let d = map(vol, 0, 1, 10, 300);

  if (vol > 0.0025) {
    let circle = {
      x: random(width),
      y: random(height),
      size: d,
      r: random(100, 255),
      g: random(100, 255),
      b: random(100, 255),
      alpha: 255
    };
    circles.push(circle);
  }

  for (let i = circles.length - 1; i >= 0; i--) {
    let c = circles[i];
    fill(c.r, c.g, c.b, c.alpha);
    ellipse(c.x, c.y, c.size);
    c.alpha -= 3;
    if (c.alpha <= 0) {
      circles.splice(i, 1);
    }
  }

  fill(255);
  ellipse(width / 2, height / 2, d);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
