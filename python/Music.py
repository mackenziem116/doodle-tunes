from musthe import *

import mysql.connector
import pandas as pd

import random
import itertools

cnxn = mysql.connector.connect(
    host='127.0.0.1',
    user='mackenziem',
    password='password',
    database='doodle_tunes'
)

cursor = cnxn.cursor()
cursor.execute('SELECT * FROM notes')

table_rows = cursor.fetchall()
notes_table = pd.DataFrame(table_rows,
                  columns=['note_id', 'note_name', 'octave', 'midi_num', 'freq'])

def get_id(note):
    return df[(df.note_name == str(note)) & (df.octave == note.octave)].iloc[0,0]

possible_keys = ['C4', 'A4']
possible_tonalities = ['major', 'harmonic_minor']

key = Note(random.choice(possible_keys))
tonality = random.choice(possible_tonalities)


possible_notes = [*Scale(key, tonality)]
melodies = list(itertools.permutations(possible_notes, 4))

a = Note('A4')
b = Note('G4')

print(a.less_than(b))
#good_melodies = []
#lowest = 'G4'
#highest = 'A5'
#for m in melodies:
#    good = True
#    for n in m:
#        pass
#    
#
#
#
#possible_harmony_beats = [(1, 2, 3, 4), 
#                          (1, 3, 4),
#                          (1, 2, 4),
#                          (1, 3)]
#
#possible_harmony_qualities = ['maj', 'min']
#
#tunes = []
#for m in melodies:
#    tune = {'melody': m}
#    harmony_beats = random.choice(possible_harmony_beats)
#    for beat in harmony_beats:
#        harmony_quality = random.choice(possible_harmony_qualities)
#        root = m[beat - 1]
#        chord = Chord(root, harmony_quality)
#        notes = random.sample(chord.notes, 2)
#        tune.update({beat:notes})
#    tunes.append(tune)
        



