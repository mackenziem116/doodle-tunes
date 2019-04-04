import java.util.*;
import de.bezier.data.sql.*;


MySQL cnxn;
String[] config;
HashMap<String , Integer> doodles;
ArrayList<String> doodle_ids;

int current = 0;

void setup() {
  fullScreen();

  doodles = new HashMap<String, Integer>();

  config = new String[]{"34.73.43.3", "doodletunes", "admin", "R3bingst"};
  cnxn = new MySQL(this, config[0], config[1], config[2], config[3]);

  if (!cnxn.connect()) {
    println("Connection to doodletunes-db failed.");
    exit();
  }

  cnxn.query("SELECT doodle_id, COUNT(*) as num_paths " +
             "FROM path_characteristics GROUP BY doodle_id");
             
  String[] filter = {};
             
  while (cnxn.next()) {
    String id = cnxn.getString("doodle_id");
    int num = cnxn.getInt("num_paths");
    boolean contains = Arrays.asList(filter).contains(id);
    if (contains || Arrays.asList(filter).isEmpty()) {
      doodles.put(id, num);
    }
  }

   doodle_ids = new ArrayList(doodles.keySet());
   new_doodle();
}

void mousePressed() {
  new_doodle();
}

void draw() {

}

void new_doodle() {
  background(#F0EEE1);

  String d = doodle_ids.get(current);
  int n = doodles.get(d);

  for (int i = 0; i < n; i++) {
    int r, g, b, w;
    cnxn.query("SELECT * FROM path_characteristics " +
               "WHERE doodle_id = \"" + d + "\" AND path_number = " + i);
   
    cnxn.next();
    r = cnxn.getInt("color_r");
    g = cnxn.getInt("color_g");
    b = cnxn.getInt("color_b");
    w = cnxn.getInt("stroke_weight");

    cnxn.query("SELECT * FROM path_verticies " +
               "WHERE doodle_id = \"" + d + "\" AND path_number = " + i);

    noFill();
    stroke(r, g, b);
    strokeWeight(w);

    beginShape();
    while (cnxn.next()) {
      float x = (float) cnxn.getDouble("vertex_x");
      float y = (float) cnxn.getDouble("vertex_y");

      vertex(x, y);
    }
    endShape();
  }

  textSize(28);
  text(d, 10, 30); 
  current += 1;
  if (current >= doodle_ids.size()) {
    current = 0;
  }
}
