from musthe import Note, Scale, Chord

import mysql.connector
import pandas as pd

import random
import itertools
from tqdm import tqdm

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

def compare(a, opp, b):
    if opp == '>':
        case1 = (a.letter.idx > b.letter.idx) and (a.octave == b.octave)
        case2 = a.octave > b.octave
        return case1 or case2
    elif opp == '<':
        case1 = (a.letter.idx < b.letter.idx) and (a.octave == b.octave)
        case2 = a.octave < b.octave
        return case1 or case2

possible_keys = ['C4', 'A4']
possible_tonalities = ['major', 'harmonic_minor']

key = Note(random.choice(possible_keys))
tonality = random.choice(possible_tonalities)

tune_chars = list(itertools.product(possible_keys, possible_tonalities))

melodies = []
good_melodies = []

for k, t in tune_chars:
    possible_notes = [*Scale(k, t)]
    melodies += (list(itertools.permutations(possible_notes, 4)))

lowest = Note('G4')
highest = Note('A5')
for melody in tqdm(melodies):
    good = True
    for note in melody:
        if compare(note, '<', lowest):
            good = False
        elif compare(note, '>', highest):
            good = False
        else:
            pass
        
    if good:
        good_melodies.append(m)
        
print(len(melodies), len(good_melodies))
            
    

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
        



