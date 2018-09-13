

class DataFormat {

  constructor(db, sessionID, drawing) {
    this.sessionID = sessionID;
    this.drawing = drawing;
    this.drawingID = Math.random().toString(24).substr(2, 15);
    this.db = db;
    this.timestamp = this.db.createTimestamp();
  }

  addToDrawingTable() {
    console.log(this.sessionID, this.drawingID, this.timestamp);
  }

  addToPathTable() {
    for (var i = 0; i < drawing.length; i++) {
      var path = drawing[i];
      var rgb = path.color.levels;
      console.log(this.drawingID, i, rgb[0], rgb[1], rgb[2], path.weight);
    }
  }

  addToVertexTable() {
    for (var i = 0; i < drawing.length; i++) {
      var path = drawing[i].path;
      for (var j = 0; j < path.length; j++) {
        var vertex = path[j];
        console.log(this.drawingID, i, j, vertex.x, vertex.y);
      }
    }
  }
}
