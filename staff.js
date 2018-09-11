const VF = Vex.Flow;

var vf = new VF.Factory({
  renderer: {elementId: 'staff', width: 450, height: 200}
});

var score = vf.EasyScore();
var system = vf.System();

system.addStave({
  voices: [
    score.voice(score.notes('C5/q, G4, D5, C5', {stem: 'up'})),
    score.voice(score.notes('(C4 E4)/h, (F4 G4)/q, (E4 G4)/q', {stem: 'down'}))
  ]
}).addClef('treble').addTimeSignature('4/4');

vf.draw();
