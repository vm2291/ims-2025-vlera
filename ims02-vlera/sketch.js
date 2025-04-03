//Source: https://openprocessing.org/sketch/2580004

let theShader;
let fsButton;

function preload() {
  theShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  fsButton = createButton("Fullscreen");
  fsButton.position(20, 20);
  fsButton.style("font-size", "20px");
  fsButton.mousePressed(enterFullscreen);
}

function draw() {
  shader(theShader);
  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform("u_time", millis() / 1000.0);
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function enterFullscreen() {
  fullscreen(true);        
  fsButton.remove();       
  resizeCanvas(windowWidth, windowHeight); 
}