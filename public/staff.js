class Staff {

  constructor(VF) {
    this.vf = new VF.Factory({
      renderer: {elementId: 'staff', width: 450, height: 200}
    });
  }

  createStaff(melody, harmony) {

    var score = this.vf.EasyScore();
    var system = this.vf.System();

    system.addStave({
      voices: [
        score.voice(score.notes(melody, {stem: 'up'})),
        score.voice(score.notes(harmony, {stem: 'down'}))
      ]
    }).addClef('treble').addTimeSignature('4/4');

    vf.draw();
  }
}
