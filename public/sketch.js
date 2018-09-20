var drawing = [];
var drawingRedo = []
var drawingClear = -1;

var undoPath;
var redoPath;

var currentPath;
var currentColor;
var currentWeight;

var checkPos;

var canvas;
var colorButtons;
var weightButtons;
var toolButtons;
var playButtons;

var bounds;

var eraser;

var socket;
var sessionID;

var keys = [];
var playback;
<<<<<<< HEAD:public/sketch.js
var melody;
var harmony;

var staff;
=======
var draw_notes;

var staff;
var images;
>>>>>>> f1a85b57a1678da194fae961ee366b5a8e0f093e:public/sketch.js

border = 12;

function positionDOMs() {
  var x = ((windowWidth - width) / 2);
  var y = -30;
  canvas.position(x, y);

  spacing = .8 * ((canvas.height - (border * 4)) / colorButtons.length);
  for (var i = 0; i < colorButtons.length; i++) {
    cbY = y + (i * spacing) + (canvas.y) + 200;
    colorButtons[i].position(x + canvas.width + 10, cbY);
  }

  for (var i = 0; i < toolButtons.length; i++) {
    cbY = y + (i * spacing) + (canvas.y) + 200;
    toolButtons[i].position(x - 70, cbY);
  }

  for (var i = 0; i < weightButtons.length; i++) {
    cbX = (i * spacing) + (canvas.x) + 60;
    weightButtons[i].position(cbX, y + canvas.height);
  }

<<<<<<< HEAD:public/sketch.js
  playButtons[0].position(x - 105, -97);
  playButtons[1].position(x + canvas.width + 12, -97);
=======
  playButtons[0].position(x - 80, 32);
  playButtons[1].position(x + canvas.width + 12, 32);
>>>>>>> f1a85b57a1678da194fae961ee366b5a8e0f093e:public/sketch.js

}

function setColor(c) {
  eraser = false;
  currentColor = c;
}

function createColorButtons() {

  var colorNames = ['Black', 'Red', 'Yellow', 'Blue', 'White'];
  var colorsHex = ['#000', '#f00', '#ff0', '#00f', '#fff'];

  buttonBlack = createButton('');
  buttonBlack.parent('#main-canvas');
  buttonBlack.class('black color-button')
  buttonBlack.mousePressed(function() {
    setColor(color(colorsHex[0]));
  });

  buttonWhite = createButton('');
  buttonWhite.parent('#main-canvas');
  buttonWhite.class('white color-button');
  buttonWhite.mousePressed(function() {
    setColor(color(colorsHex[4]));
  });

  buttonRed = createButton('');
  buttonRed.parent('#main-canvas');
  buttonRed.class('red color-button');
  buttonRed.mousePressed(function() {
    setColor(color(colorsHex[1]));
  });

  buttonYellow = createButton('');
  buttonYellow.parent('#main-canvas');
  buttonYellow.class('yellow color-button');
  buttonYellow.mousePressed(function() {
    setColor(color(colorsHex[2]));
  });

  buttonBlue = createButton('');
  buttonBlue.parent('#main-canvas');
  buttonBlue.class('blue color-button');
  buttonBlue.mousePressed(function() {
    setColor(color(colorsHex[3]));
  });

  colorButtons = [buttonBlack, buttonWhite, buttonRed, buttonYellow, buttonBlue]
}

function createWeightButtons() {

  button1px = createButton('2px');
  button1px.parent('#main-canvas');
  button1px.class('weight-button');
  button1px.mousePressed(function() {
    currentWeight = 2;
  });

  button2px = createButton('4px');
  button2px.parent('#main-canvas');
  button2px.class('weight-button');
  button2px.mousePressed(function() {
    currentWeight = 4;
  });

  button4px = createButton('8px');
  button4px.parent('#main-canvas');
  button4px.class('weight-button');
  button4px.mousePressed(function() {
    currentWeight = 8;
  });

  button8px = createButton('16px');
  button8px.parent('#main-canvas');
  button8px.class('weight-button');
  button8px.mousePressed(function() {
    currentWeight = 16;
  });

  weightButtons = [button1px, button2px, button4px, button8px]
}

function createToolButtons() {

  buttonClear = createButton("Clear");
  buttonClear.parent('#main-canvas');
  buttonClear.class('tool-button');
  buttonClear.mousePressed(function() {
    drawingClear = drawing;
    drawing = [];

  });

  buttonErase = createButton("Erase");
  buttonErase.parent('#main-canvas');
  buttonErase.class('tool-button');
  buttonErase.mousePressed(function() {
    eraser = true;
    setColor(color('#EAE2CF'));
  });

  buttonUndo = createButton("Undo");
  buttonUndo.parent('#main-canvas');
  buttonUndo.class('tool-button');
  buttonUndo.mousePressed(function() {

    if (drawingClear !== -1) {
      drawing = drawingClear
      drawingClear = -1;
    } else if (drawing.length > 0) {
      undid = drawing.pop();
      drawingRedo.push(undid);
    }

  });

  buttonRedo = createButton("Redo");
  buttonRedo.parent('#main-canvas');
  buttonRedo.class('tool-button');
  buttonRedo.mousePressed(function() {

    if (drawingRedo.length > 0) {
      redone = drawingRedo.pop();
      drawing.push(redone);
    }

  });

  buttonSave = createButton("Submit");
  buttonSave.parent('#main-canvas');
  buttonSave.class('tool-button');
  buttonSave.mousePressed(function() {
    var df = new DataFormat(drawing);
    df.addToDrawingTable(socket);
    df.addToPathTable(socket);
    df.addToVertexTable(socket);

    drawing = [];

    socket.emit('getNewTune');
  });

  toolButtons = [buttonClear, buttonErase, buttonUndo, buttonRedo, buttonSave];
}

function drawPath() {
  drawingClear = -1;

  currentPath = [];

  piece = {
    path: currentPath,
    color: currentColor,
    weight: currentWeight
  }

  drawing.push(piece);
}

function createDrawing() {

  fill(color('#EAE2CF'));
  noStroke();
  rectMode(CORNERS);
  rect(bounds.left, bounds.top, bounds.right, bounds.bottom, 30);

  x = mouseX;
  y = mouseY;

  checkPos = x < bounds.right - border
             && x > bounds.left + border
             && y > bounds.top + border
             && y < bounds.bottom - border;

  if (mouseIsPressed && checkPos) {
    var point = {
      x: x,
      y: y
    }
    currentPath.push(point);
  }

  noFill();
  for (var i = 0; i < drawing.length; i++) {

    path = drawing[i].path;
    c = drawing[i].color;
    w = drawing[i].weight;

    stroke(c);
    strokeWeight(w);

    beginShape();
    for (var j = 0; j < path.length; j++) {
      vertex(path[j].x, path[j].y);
    }
    endShape();
  }
}

function createPlayButton() {
  buttonPlay = createButton("Play");
<<<<<<< HEAD:public/sketch.js
  buttonPlay.parent('#doodle-canvas');
=======
  buttonPlay.parent('#main-canvas');
>>>>>>> f1a85b57a1678da194fae961ee366b5a8e0f093e:public/sketch.js
  buttonPlay.class('play-button');
  buttonPlay.mousePressed(playMusic);

  buttonNext = createButton("Next");
<<<<<<< HEAD:public/sketch.js
  buttonNext.parent('#doodle-canvas');
=======
  buttonNext.parent('#main-canvas');
>>>>>>> f1a85b57a1678da194fae961ee366b5a8e0f093e:public/sketch.js
  buttonNext.class('play-button');
  buttonNext.mousePressed(function() {
    socket.emit('getNewTune');
  });

  playButtons = [buttonPlay, buttonNext]
}

async function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}

async function playMusic() {
<<<<<<< HEAD:public/sketch.js

  time = 600;

=======

  time = 600;

>>>>>>> f1a85b57a1678da194fae961ee366b5a8e0f093e:public/sketch.js
  for (var i = 0; i < playback.length; i++) {
    beat = playback[i];
    for (var j = 0; j < beat.length; j++) {
      midi_num = beat[j] - 1;
      keys[midi_num].play();
    }
    await sleep(time);
  }
}

function setup() {
<<<<<<< HEAD:public/sketch.js
  canvas = createCanvas(400, 400);
=======
  canvas = createCanvas(400, 550);
>>>>>>> f1a85b57a1678da194fae961ee366b5a8e0f093e:public/sketch.js
  canvas.parent('#main-canvas');
  canvas.style('canvas');
  canvas.mousePressed(drawPath);

  for (var i = 1; i < 62; i++) {
    path = 'wav/' + i + '.wav'
    keys.push(loadSound(path))
  }

  createColorButtons();
  createToolButtons();
  createWeightButtons();
  createPlayButton();
  positionDOMs();

  eraser = false;

  currentColor = color('#000');
  currentWeight = 4;

  bounds = {
    top: 150 + border,
    bottom: canvas.height - border,
    left: border,
    right: canvas.width - border
  }

  socket = io.connect('http://localhost:3000');
  socket.on('sendTune', function(data) {
<<<<<<< HEAD:public/sketch.js
    playback = Object.values(data).slice(0, 4);
    melody = data.melody
    harmony = data.harmony
  });

  // var vf = new Vex.Flow.Factory({renderer: {elementId: 'staff'}});
  // staff = new Staff(vf)
=======
    playback = Object.values(data.midi);
    draw_notes = data.notes;
  });

  staff = new Staff(0, 60, canvas.width - 10, 55);
  treble_clef = loadImage("img/treble_clef.jpg");
  time_sig_4_4 = loadImage("img/time_sig_4_4.jpg");

  images = {
    treble: treble_clef,
    four_four: time_sig_4_4
  }
>>>>>>> f1a85b57a1678da194fae961ee366b5a8e0f093e:public/sketch.js
}

function draw() {
  background(color('#F0EEE1'));
  createDrawing();

  if (eraser) {
    strokeWeight(2);
    stroke(0);
    noFill();
    ellipse(mouseX, mouseY, 2 * currentWeight, 2 * currentWeight);
  }

  noFill();
  stroke(color('#777'));
  strokeWeight(border);
  rectMode(CORNERS);
  rect(bounds.left, bounds.top, bounds.right, bounds.bottom, 30);

<<<<<<< HEAD:public/sketch.js
  socket.on('sendTune', function(data) {
    playback = Object.values(data).slice(0, 4);
    melody = data.melody
    harmony = data.harmony
  });

  // staff.createStaff(harmony, melody);
=======

  socket.on('sendTune', function(data) {
    playback = Object.values(data.midi);
    draw_notes = data.notes;
  });

  staff.createStaff(images['treble'], images['four_four']);

  if (draw_notes != undefined) {
    for (var i = 0; i < draw_notes.length; i++) {
      var n = draw_notes[i];
      staff.place_note(n[0], n[1], n[2], n[3], n[4]);
    }
  }

>>>>>>> f1a85b57a1678da194fae961ee366b5a8e0f093e:public/sketch.js
}

function windowResized() {
  positionDOMs();
}
