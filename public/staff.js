<<<<<<< HEAD
// class Staff {
//
//   constructor(vf) {
//     this.vf = vf;
//   }
//
//   createStaff(melody, harmony) {
//
//     var vf = new Vex.Flow.Factory({renderer: {elementId: 'staff'}});
//
//     var score = this.vf.EasyScore();
//     var system = this.vf.System();
//
//     system.addStave({
//       voices: [
//         score.voice(score.notes(melody, {stem: 'up'})),
//         score.voice(score.notes(harmony, {stem: 'down'}))
//       ]
//     }).addClef('treble').addTimeSignature('4/4');
//
//     this.vf.draw();
//   }
// }

// VF = Vex.Flow;

// var vf = new Vex.Flow.Factory({
//     renderer: {
//         selector: 'staff',
//         height: 800,
//         width: 800
//     }
// });
//
// var score = vf.EasyScore();
// var system = vf.System();
//
// system.addStave({
//     voices: [
//         score.voice(score.notes('C#5/q, B4, A4, G#4', {
//             stem: 'up'
//         })),
//         score.voice(score.notes('C#4/h, C#4', {
//             stem: 'down'
//         }))
//     ]
// }).addClef('treble').addTimeSignature('4/4');
=======
class Staff {

  constructor(x, y, length, height) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.height = height
    this.spacing = height / 5;

    this.beats = {
      1: this.x + this.spacing * 10,
      2: this.x + this.spacing * 16.66,
      3: this.x + this.spacing * 23.33,
      4: this.x + this.spacing * 30
    }
  }

  createStaff(cleff, time_sig) {

    strokeWeight(1);
    stroke(0);
    for (var i = 0; i < 5; i++) {
        var new_x = this.x + this.length;
        var new_y = this.y + (i * this.spacing);
        line(this.x, new_y, new_x, new_y);
    }

    image(cleff, this.x - this.spacing * 1.2,
                 this.y - this.spacing * 1.7,
                 this.spacing * 7,
                 this.spacing * 8);

    image(time_sig, this.x + this.spacing * 4,
                    this.y + this.spacing * .19 ,
                    this.spacing * 1.6,
                    this.spacing * 3.7);
  }


  place_note(note, octave, beat, duration, stem) {

    var notes = {
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
  }
}
>>>>>>> f1a85b57a1678da194fae961ee366b5a8e0f093e
