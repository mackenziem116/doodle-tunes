class Staff {

  constructor(x, y, length, height, images) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.height = height;
    this.spacing = height / 5;

    this.beats = {
      1: this.x + this.spacing * 10,
      2: this.x + this.spacing * 16.66,
      3: this.x + this.spacing * 23.33,
      4: this.x + this.spacing * 30
    }

    this.images = images;
  }

  createStaff(cleff, time_sig) {

    strokeWeight(1);
    stroke(0);
    for (var i = 0; i < 5; i++) {
        var new_x = this.x + this.length;
        var new_y = this.y + (i * this.spacing);
        line(this.x, new_y, new_x, new_y);
    }

    image(this.images[cleff], this.x - this.spacing * 1.2,
                 this.y - this.spacing * 1.7,
                 this.spacing * 7,
                 this.spacing * 8);

    image(this.images[time_sig], this.x + this.spacing * 4,
                    this.y + this.spacing * .19 ,
                    this.spacing * 1.6,
                    this.spacing * 3.7);
  }

  place_note(note_details) {

    var note_all = note_details['note_name']

    var note;
    var accidental;

    if (note_all.length == 2) {
      note = note_all.substring(0, 1);
      var accidental_sign = note_all.substring(1, 2);

      if (accidental_sign == '#') {
        accidental = 'sharp'
      } else if (accidental_sign == 'b') {
        accidental = 'flat'
      }

    } else {
      note = note_all
      accidental = ''
    }

    var octave = note_details['note_octave'];
    var beat = note_details['beat_number'];
    var duration = note_details['duration'];
    var stem = note_details['stem'];

    switch (duration) {
      case 1:
        duration = 'q';
        break;
      case 2:
        duration = 'h';
        break;
      default:
        break;
    }

    switch (stem) {
      case 0:
        stem = 'up';
        break;
      case 1:
        stem = 'down';
        break;
      default:
        break;
    }

    var notes = {
      B3: 5.5,
      C4: 5.0,
      D4: 4.5,
      E4: 4.0,
      F4: 3.5,
      G4: 3.0,
      A4: 2.5,
      B4: 2.0,
      C5: 1.5,
      D5: 1.0,
      E5: 0.5,
      F5: 0.0,
      G5: -0.5,
      A5: -1.0
    }

    var stems = {
      up: {
        len: -this.spacing*2.5,
        side: this.spacing * .5
      },
      down: {
        len: this.spacing*2.5,
        side: -this.spacing * .5
      }
    }

    if (duration == 'q') {
      fill(0);
    } else {
      noFill();
    }

    var x = this.beats[beat];
    var y = this.y + this.spacing * notes[note+octave]
    strokeWeight(1.5);
    ellipse(x, y, this.spacing * .9, this.spacing * .7);
    line(x + stems[stem].side, y, x + stems[stem].side, y + stems[stem].len);

    if (notes[note+octave] >= 5 || notes[note+octave] < 0) {
      strokeWeight(1);
      line(x - this.spacing, y, x + this.spacing, y);
    }

    if (accidental != '') {
      image(this.images[accidental], x - this.spacing * 1.7, y - this.spacing * .6, this.spacing * 1.1, this.spacing * 1.1)
    }
  }
}
