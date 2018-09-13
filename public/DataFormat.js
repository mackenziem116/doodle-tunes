class DataFormat {

  constructor(drawing) {
    this.drawing = drawing;
    this.drawingID = Math.random().toString(24).substr(2, 15);
  }

  addToDrawingTable(socket) {
    var data = {
      drawing_id: this.drawingID
    }
    socket.emit('drawingTable', data);
  }

  addToPathTable() {
    for (var i = 0; i < drawing.length; i++) {
      var path = drawing[i];
      var rgb = path.color.levels;

      var data = {
        drawing_id: this.drawingID,
        path_number: i,
        color_r: rgb[0],
        color_g: rgb[1],
        color_b: rgb[2],
        stroke_weight: path.weight
      }
      socket.emit('pathTable', data);
    }
  }

  addToVertexTable() {
    for (var i = 0; i < drawing.length; i++) {
      var path = drawing[i].path;
      for (var j = 0; j < path.length; j++) {
        var vertex = path[j];
        var data = {
          drawing_id: this.drawingID,
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
