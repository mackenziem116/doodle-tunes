class DataFormat {

  constructor(doodle) {
    this.doodle = doodle;
    this.doodleID = Math.random().toString(24).substr(2, 15);
  }

  addToDrawingTable(socket, tune) {
    var data = {
      doodle_id: this.doodleID,
      tune_id: tune
    }
    socket.emit('doodleTable', data);
  }

  addToPathTable(socket) {
    console.log(this.doodle)
    for (var i = 0; i < this.doodle.length; i++) {
      var path = this.doodle[i];
      var rgb = path.color.levels;

      var data = {
        doodle_id: this.doodleID,
        path_number: i,
        color_r: rgb[0],
        color_g: rgb[1],
        color_b: rgb[2],
        stroke_weight: path.weight
      }
      socket.emit('pathTable', data);
    }
  }

  addToVertexTable(socket) {
    for (var i = 0; i < this.doodle.length; i++) {
      var path = this.doodle[i].path;
      for (var j = 0; j < path.length; j++) {
        var vertex = path[j];
        var data = {
          doodle_id: this.doodleID,
          path_number: i,
          vertex_number: j,
          vertex_x: vertex.x,
          vertex_y: vertex.y
        }
        socket.emit('vertexTable', data);
      }
    }
  }
}
