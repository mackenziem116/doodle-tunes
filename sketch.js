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

var bounds;

var eraser;

var db;
var sessionID;

border = 12;

function centerDOMs() {
  var x = ((windowWidth - width) / 2);
  var y = 5;
  canvas.position(x, y);

  spacing = (canvas.height - (border * 4)) / colorButtons.length;
  for (var i = 0; i < colorButtons.length; i++) {
    cbY = y + (i * spacing) + (canvas.y) + 20;
    colorButtons[i].position(x + canvas.width + 10, cbY);
  }

  for (var i = 0; i < toolButtons.length; i++) {
    cbY = y + (i * spacing) + (canvas.y) + 20;
    toolButtons[i].position(x - 70, cbY);
  }

  for (var i = 0; i < weightButtons.length; i++) {
    cbX = (i * spacing) + (canvas.x) + 60;
    weightButtons[i].position(cbX, y + canvas.height);
  }
}

function setColor(c) {
  eraser = false;
  currentColor = c;
}

function createColorButtons() {

  var colorNames = ['Black', 'Red', 'Yellow', 'Blue', 'White'];
  var colorsHex = ['#000', '#f00', '#ff0', '#00f', '#fff'];

  buttonBlack = createButton('');
  buttonBlack.parent('#doodle-canvas');
  buttonBlack.class('black color-button')
  buttonBlack.mousePressed(function() {
    setColor(color(colorsHex[0]));
  });

  buttonWhite = createButton('');
  buttonWhite.parent('#doodle-canvas');
  buttonWhite.class('white color-button');
  buttonWhite.mousePressed(function() {
    setColor(color(colorsHex[4]));
  });

  buttonRed = createButton('');
  buttonRed.parent('#doodle-canvas');
  buttonRed.class('red color-button');
  buttonRed.mousePressed(function() {
    setColor(color(colorsHex[1]));
  });

  buttonYellow = createButton('');
  buttonYellow.parent('#doodle-canvas');
  buttonYellow.class('yellow color-button');
  buttonYellow.mousePressed(function() {
    setColor(color(colorsHex[2]));
  });

  buttonBlue = createButton('');
  buttonBlue.parent('#doodle-canvas');
  buttonBlue.class('blue color-button');
  buttonBlue.mousePressed(function() {
    setColor(color(colorsHex[3]));
  });

  colorButtons = [buttonBlack, buttonWhite, buttonRed, buttonYellow, buttonBlue]
}

function createWeightButtons() {

  button1px = createButton('2px');
  button1px.parent('#doodle-canvas');
  button1px.class('weight-button');
  button1px.mousePressed(function() {
    currentWeight = 2;
  });

  button2px = createButton('4px');
  button2px.parent('#doodle-canvas');
  button2px.class('weight-button');
  button2px.mousePressed(function() {
    currentWeight = 4;
  });

  button4px = createButton('8px');
  button4px.parent('#doodle-canvas');
  button4px.class('weight-button');
  button4px.mousePressed(function() {
    currentWeight = 8;
  });

  button8px = createButton('16px');
  button8px.parent('#doodle-canvas');
  button8px.class('weight-button');
  button8px.mousePressed(function() {
    currentWeight = 16;
  });

  weightButtons = [button1px, button2px, button4px, button8px]
}

function createToolButtons() {

  buttonClear = createButton("Clear");
  buttonClear.parent('#doodle-canvas');
  buttonClear.class('tool-button');
  buttonClear.mousePressed(function() {
    drawingClear = drawing;
    drawing = [];

  });

  buttonErase = createButton("Erase");
  buttonErase.parent('#doodle-canvas');
  buttonErase.class('tool-button');
  buttonErase.mousePressed(function() {
    eraser = true;
    setColor(color('#EAE2CF'));
  });

  buttonUndo = createButton("Undo");
  buttonUndo.parent('#doodle-canvas');
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
  buttonRedo.parent('#doodle-canvas');
  buttonRedo.class('tool-button');
  buttonRedo.mousePressed(function() {

    if (drawingRedo.length > 0) {
      redone = drawingRedo.pop();
      drawing.push(redone);
    }

  });

  buttonSave = createButton("Submit");
  buttonSave.parent('#doodle-canvas');
  buttonSave.class('tool-button');
  buttonSave.mousePressed(function() {
    var fin = new DataFormat(db, sessionID, drawing);
    fin.addToDrawingTable();
    fin.addToPathTable();
    fin.addToVertexTable();
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

function setup() {
  db = new DBConnect();
  sessionID = Math.random().toString(24).substr(2, 15);

  console.log(sessionID, db.createTimestamp());

  canvas = createCanvas(400, 400);
  canvas.parent('#doodle-canvas');
  canvas.style('canvas');
  canvas.mousePressed(drawPath);

  createColorButtons();
  createToolButtons();
  createWeightButtons();
  centerDOMs();

  eraser = false;

  currentColor = color('#000');
  currentWeight = 4;

  bounds = {
    top: border,
    bottom: canvas.height - border,
    left: border,
    right: canvas.width - border
  }
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
}

function windowResized() {
  centerDOMs();
}
