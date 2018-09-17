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
