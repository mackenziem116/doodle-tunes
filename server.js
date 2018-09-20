const express = require('express');
const socket = require('socket.io');
const mysql = require('mysql');

var count = 0;

var app = express();
var server = app.listen(3000);

app.use(express.static('public'))

var io = socket(server);
io.sockets.on('connection', newConnection)

function newConnection(socket) {

  var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'mackenziem',
    password : 'password',
    database : 'doodle_tunes'
  });

  var sessionTable = {
    session_id: socket.id,
    session_start: createTimestamp()
  }

  // insertInto(connection, 'sessions', sessionTable);

  socket.on('doodleTable', function(data) {

    var data = {
      session_id: socket.id,
      doodle_id: data.doodle_id,
      drawing_time: createTimestamp()
    }

    // insertInto(connection, 'doodles', data);
  });

  socket.on('pathTable', function(data) {
    // insertInto(connection, 'path_characteristics', data);
  });

  socket.on('vertexTable', function(data) {
    // insertInto(connection, 'path_verticies', data);
  });

  midi_data = {
    1: [52, 44, 40],
    2: [47],
    3: [54, 47, 45],
    4: [52, 47, 44],
  }

  note_data = [
    ['C', 5, 1, 'q', 'up'],
    ['G', 4, 2, 'q', 'up'],
    ['D', 5, 3, 'q', 'up'],
    ['C', 5, 4, 'q', 'up'],
    ['C', 4, 1, 'h', 'down'],
    ['E', 4, 1, 'h', 'down'],
    ['F', 4, 3, 'q', 'down'],
    ['G', 4, 3, 'q', 'down'],
    ['E', 4, 4, 'q', 'down'],
    ['G', 4, 4, 'q', 'down']
  ]

  data={
    midi: midi_data,
    notes: note_data
  }

  socket.emit('sendTune', data);

  socket.on('getNewTune', function() {
    count += 1;

    if (count % 2 == 1) {

      midi_data = {
        1: [56, 40, 39],
        2: [52],
        3: [52, 47, 45],
        4: [49, 45, 40]
      }

      note_data = [
        ['E', 5, 1, 'q', 'up'],
        ['C', 5, 2, 'q', 'up'],
        ['C', 5, 3, 'q', 'up'],
        ['A', 4, 4, 'q', 'up'],
        ['C', 4, 1, 'h', 'down'],
        ['A', 4, 1, 'h', 'down'],
        ['G', 4, 3, 'q', 'down'],
        ['F', 4, 3, 'q', 'down'],
        ['F', 4, 4, 'q', 'down'],
        ['C', 4, 4, 'q', 'down']
      ]
    } else {

      midi_data = {
        1: [52, 44, 40],
        2: [47],
        3: [54, 47, 45],
        4: [52, 47, 44],
      }

      note_data = [
        ['C', 5, 1, 'q', 'up'],
        ['G', 4, 2, 'q', 'up'],
        ['D', 5, 3, 'q', 'up'],
        ['C', 5, 4, 'q', 'up'],
        ['C', 4, 1, 'h', 'down'],
        ['E', 4, 1, 'h', 'down'],
        ['F', 4, 3, 'q', 'down'],
        ['G', 4, 3, 'q', 'down'],
        ['E', 4, 4, 'q', 'down'],
        ['G', 4, 4, 'q', 'down']
      ]
    }

    data={
      midi: midi_data,
      notes: note_data
    }

    socket.emit('sendTune', data);
  })
}

function createTimestamp() {
  var currentDate = new Date();

  var date = currentDate.getDate();
  var month = currentDate.getMonth();
  var year = currentDate.getFullYear();
  var hour = currentDate.getHours();
  var minute = currentDate.getMinutes();
  var second = currentDate.getSeconds();

  var date = year + "-" + (month + 1) + "-" + date;
  var time = hour + ":" + minute + ":" + second;

  return date + " " + time
}

function insertInto(connection, table, data) {

  var fields = '(' + Object.keys(data).join() + ')';
  var values = '("' + Object.values(data).join('","') + '")';

  var sql = "INSERT INTO " + table + " " + fields + " VALUES " + values + ';';
  console.log(sql);

  connection.query(sql, [values], function (err, result) {
    if (err) throw err;
  });
}
