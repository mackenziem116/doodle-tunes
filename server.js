const express = require('express');
const socket = require('socket.io');
const mysql = require('mysql');

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

  insertInto(connection, 'sessions', sessionTable);

  socket.on('doodleTable', function(data) {

    var data = {
      session_id: socket.id,
      doodle_id: data.doodle_id,
      drawing_time: createTimestamp()
    }

    insertInto(connection, 'doodles', data);
  });

  socket.on('pathTable', function(data) {
    insertInto(connection, 'path_characteristics', data);
  });

  socket.on('vertexTable', function(data) {
    insertInto(connection, 'path_verticies', data);
  });

  data = {
    1: [52, 44, 40],
    2: [47],
    3: [54, 47, 45],
    4: [52, 47, 44],
    melody: 'C5/q, G4/q, D5/q, C5/q',
    harmony: '(C4 E4)/h, (F4 G4)/q, (E4 G4)/q'
  }

  socket.emit('sendTune', data);

  socket.on('getNewTune', function() {

    data = {
      1: [56, 40, 37],
      2: [52],
      3: [52, 47, 45],
      4: [49, 45, 40],
      melody: 'E5/q, C5/q, C5/q, A4/q',
      harmony: '(C4 A3)/h, (G4 F4)/q, (F4 C4)/q'
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
