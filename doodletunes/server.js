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

  insertInto(connection, 'sessions', sessionTable);

  socket.on('disconnect', function () {

    var sql = "UPDATE sessions SET session_end = \"" + createTimestamp()
              + "\" WHERE session_id = \"" + socket.id + "\"";
    // console.log(sql);

    connection.query(sql, function (err, result) {
      if (err) throw err;
    });
  });

  socket.on('doodleTable', function(data) {

    var data = {
      session_id: socket.id,
      doodle_id: data.doodle_id,
      drawing_time: createTimestamp(),
      tune_id: data.tune_id
    }

    insertInto(connection, 'doodles', data);
  });

  socket.on('pathTable', function(data) {
    insertInto(connection, 'path_characteristics', data);
  });

  socket.on('vertexTable', function(data) {
    insertInto(connection, 'path_verticies', data);
  });


  get_tune(connection, socket);
  socket.on('getNewTune', function() {
    get_tune(connection, socket);
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
  // console.log(sql);

  connection.query(sql, [values], function (err, result) {
    if (err) throw err;
  });
}

function get_tune(connection, socket) {

  sql = "SELECT u.tune_id, u.playback_number, u.note_name, u.note_octave, u.beat_number, u.duration, u.stem FROM ( SELECT t.tune_id, n.playback_number, n.note_name, n.note_octave, m.beat_number, m.duration, 0 as stem FROM tunes t NATURAL JOIN notes n NATURAL JOIN melody_notes m UNION SELECT t.tune_id, n.playback_number, n.note_name, n.note_octave, h.beat_number, h.duration, 1 as stem FROM tunes t NATURAL JOIN notes n NATURAL JOIN harmony_notes h ) AS u JOIN ( SELECT CEIL(RAND() * MAX(tune_id)) as id FROM tunes ) max_id WHERE u.tune_id = max_id.id;"

  connection.query(sql, function (err, result) {
    if (err) throw err;
    socket.emit('sendTune', result);
  });
}
