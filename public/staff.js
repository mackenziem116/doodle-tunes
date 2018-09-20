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
