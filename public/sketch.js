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
var tune_data;
var current_tune;

var staff;
var images;

const widthFactor = 0.3125
const heightFactor = 0.7971
const ip = '127.0.0.1'//'192.168.1.1'

var play_tune;

border = 12;

function positionDOMs() {
  canvas.resize(widthFactor * windowWidth, heightFactor * windowHeight);
  var x = width / 3.6;
  var y = -0.068 * height;
  canvas.position(x, y);

  spacing = .8 * ((canvas.height - (border * 4)) / colorButtons.length);
  for (var i = 0; i < colorButtons.length; i++) {
    cbY = y + (i * spacing) + (canvas.y) + height/2.6;
    colorButtons[i].position(x + canvas.width + 10, cbY);
  }

  for (var i = 0; i < toolButtons.length; i++) {
    cbY = y + (i * spacing) + (canvas.y) + height/2.6;
    toolButtons[i].position(x - 70, cbY);
  }

  for (var i = 0; i < weightButtons.length; i++) {
    cbX = (i * spacing) + (canvas.x) + width/7;
    weightButtons[i].position(cbX, y + canvas.height);
  }

  playButtons[0].position(x - 80, canvas.height * .055);
  playButtons[1].position(x - 80, canvas.height * .055);
  playButtons[2].position(x + canvas.width + 12, canvas.height * .055);

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
    df.addToDrawingTable(socket, current_tune);
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
  buttonPlay.parent('#main-canvas');
  buttonPlay.class('play-button');
  buttonPlay.mousePressed(toggleMusic);

  buttonPause = createButton("Stop");
  buttonPause.parent('#main-canvas');
  buttonPause.class('play-button');
  buttonPause.mousePressed(toggleMusic);

  buttonNext = createButton("Next");
  buttonNext.parent('#main-canvas');
  buttonNext.class('play-button');
  buttonNext.mousePressed(function() {
    play_tune = false;
    playButtons[1].hide();
    playButtons[0].show();
    socket.emit('getNewTune');
  });

  buttonPause.hide();
  playButtons = [buttonPlay, buttonPause, buttonNext]
}

async function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}

async function toggleMusic() {

  play_tune = !play_tune;

  if(play_tune) {
    playButtons[0].hide();
    playButtons[1].show();
  } else {
    playButtons[1].hide();
    playButtons[0].show();
  }

  time = 630;
  while(play_tune) {
    for (var beat = 1; beat < 5; beat++) {
      for (var i = 0; i < tune_data.length; i++) {
        note = tune_data[i];
        if (note.beat_number == beat) {
          midi_num = note.playback_number;
          keys[midi_num - 1].play();
        }
      }
      await sleep(time);
    }
  }
}

function setup() {
  canvas = createCanvas(widthFactor * windowWidth, heightFactor * windowHeight);
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

  play_tune = false;
  socket = io.connect('http://'+ip+':80');
  socket.on('sendTune', function(data) {
    tune_data = data;
    current_tune = tune_data[0].tune_id
  });

  treble_clef = loadImage("img/treble_clef.jpg");
  time_sig_4_4 = loadImage("img/time_sig_4_4.jpg");
  sharp_sign = loadImage("img/sharp.jpg")
  flat_sign = loadImage("img/flat.jpg")

  images = {
    treble: treble_clef,
    four_four: time_sig_4_4,
    sharp: sharp_sign,
    flat: flat_sign
  }

  staff = new Staff(0, canvas.height * .12, canvas.width - 10, heightFactor * .1 * windowHeight, images);
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

  socket.on('sendTune', function(data) {
    tune_data = data;
    current_tune = tune_data[0].tune_id
  });

  staff.createStaff('treble', 'four_four');

  if (tune_data != undefined) {
    for (var i = 0; i < tune_data.length; i++) {
      var note = tune_data[i];
      staff.place_note(note);
    }
  }
}

function windowResized() {
  positionDOMs();
}
