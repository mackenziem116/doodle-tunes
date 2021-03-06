const express = require('express');
var http = require('http')
var socket = require('socket.io')
const mysql = require('mysql');
const CONFIG = require('./config.json');

console.log(CONFIG)

var app = express();
app.use(express.static('public'))
app.set('port', process.env.PORT || CONFIG.vmPort);
app.set('host', process.env.HOST || CONFIG.vmHost);

server = http.createServer(app).listen(app.get('port'), app.get('host'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = socket(server);
io.sockets.on('connection', newConnection)

function newConnection(socket) {

  var connection = mysql.createConnection({
    host     : CONFIG.dbHost,
    user     : CONFIG.dbUser,
    password : CONFIG.dbPassword,
    database : CONFIG.dbName
  });

  var sessionTable = {
    session_id: socket.id,
    session_start: createTimestamp()
  }

  insertInto(connection, 'sessions_start', sessionTable);

  socket.on('disconnect', function () {

    var sessionTable = {
      session_id: socket.id,
      session_end: createTimestamp()
    }
    
    insertInto(connection, 'sessions_end', sessionTable);
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
