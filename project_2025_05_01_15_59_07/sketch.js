let capture;
let slices = 8;
let bgColor;
let poseNet;
let poses = [];
let r;
let tintVal = 255;
let fsButton;
let instr;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  textureMode(NORMAL);

  capture = createCapture(VIDEO);
  capture.size(320, 240);
  capture.hide();

  bgColor = color(128);

  poseNet = ml5.poseNet(capture.elt, () => console.log('PoseNet ready'));
  poseNet.on('pose', gotPoses);

  fsButton = createButton('Fullscreen');
  fsButton.position(10, 10);
  fsButton.style('font-size', '16px');
  fsButton.mousePressed(() => fullscreen(true));

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) fsButton.hide();
    else fsButton.show();
  });

  instr = createDiv('Raise your RIGHT hand above your nose to change the number of slices and the background color');
  instr.position(10, 40);
  instr.style('color', 'white');
  instr.style('background', 'rgba(0,0,0,0.5)');
  instr.style('padding', '4px');
  instr.style('font-size', '16px');
  instr.style('width', `${windowWidth}px`);
instr.style('text-align', 'center');
instr.position(0, 40);

  windowResized();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  r = min(windowWidth, windowHeight) * 0.6;
}

function gotPoses(results) {
  poses = results;
}

function draw() {
  capture.loadPixels();
  background(bgColor);

  rotateX(PI);
  translate(0, 0, -200);

  if (poses.length > 0) {
    let p = poses[0].pose;
    let w = p.rightWrist;
    let n = p.nose;
    if (w.confidence > 0.3 && n.confidence > 0.3 && w.y < n.y) {
      slices = int(random(6, 11));
      let pastel = color(random(180,240), random(180,240), random(180,240));
      bgColor = lerpColor(bgColor, pastel, 0.2);
      tintVal = lerp(tintVal, random(200,255), 0.2);
    }
  }

  let angle = 360 / slices;
  for (let i = 0; i < slices; i++) {
    push();
    rotateZ(i * angle);
    beginShape();
      texture(capture);
      vertex(0, 0, 0, 0.5, 0.5);
      let x1 = cos(-angle/2)*r, y1 = sin(-angle/2)*r;
      let x2 = cos(angle/2)*r,  y2 = sin(angle/2)*r;
      tint(tintVal, 255);
      vertex(x1, y1, 0, 0, 1);
      vertex(x2, y2, 0, 1, 1);
    endShape();
    pop();
  }
}
