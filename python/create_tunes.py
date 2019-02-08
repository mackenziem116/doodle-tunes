from musthe import Note, Scale, Chord

import mysql.connector
import pandas as pd

import random
import itertools
from tqdm import tqdm

import json
with open('../config.json') as f:
    config = json.load(f)

cnxn = mysql.connector.connect(
    host=config['dbHost'],
    user='python',
    password='pyPa55word',
    database=config['dbName']
)

cursor = cnxn.cursor()
cursor.execute('SELECT * FROM notes')

table_rows = cursor.fetchall()
notes_table = pd.DataFrame(table_rows,
                  columns=['note_id', 'note_name', 'octave', 'midi_num', 'freq'])

def get_id(note):
    return notes_table[(notes_table.note_name == str(note)) & (notes_table.octave == note.octave)].iloc[0,0]

def compare(a, opp, b):
    if opp == '>':
        case1 = (a.letter.idx > b.letter.idx) and (a.octave == b.octave)
        case2 = a.octave > b.octave
        return case1 or case2
    elif opp == '<':
        case1 = (a.letter.idx < b.letter.idx) and (a.octave == b.octave)
        case2 = a.octave < b.octave
        return case1 or case2

possible_keys = ['A', 'C', 'D', 'F', 'G', 'Bb', 'Eb']
possible_tonalities = ['major', 
                       'natural_minor',
                       'harmonic_minor',
                       'major_pentatonic']

key = Note(random.choice(possible_keys))
tonality = random.choice(possible_tonalities)

tune_chars = list(itertools.product(possible_keys, possible_tonalities))

melodies = []
good_melodies = []

for k, t in tune_chars:
    k_note = Note(k + '3')
    possible_notes = [*Scale(k_note, t)][:14]
    for melody in list(itertools.permutations(possible_notes, 4)):
        melodies.append((melody, k, t))

lowest = Note('F4')
highest = Note('A#5')
for melody, k, t in tqdm(melodies):
    good = True
    for note in melody:
        if compare(note, '<', lowest):
            good = False
        elif compare(note, '>', highest):
            good = False
        elif '##' in str(note) or 'bb' in str(note):
            good = False
        else:
            pass

    if good and len(melody) == 4:
        good_melodies.append((melody, k, t))

#print('Started with %i melodies, \nended with %i.' % (len(melodies), len(good_melodies)))


possible_harmony_beats = [((1, 1), (2, 1), (3, 1), (4, 1)),
                          ((1, 2), (3, 1), (4, 1)),
                          ((1, 1), (2, 2), (4, 1)),
                          ((1, 2), (3, 2))]

possible_harmony_qualities = ['maj', 'min']

lowest = Note('B3')
highest = Note('A4')

tunes = []
for melody, k, t in good_melodies:
    tune = {'key': k,
            'tonality': t,
            'melody': melody}

    harmony_beats = random.choice(possible_harmony_beats)
    beats = {}
    for beat, dur in harmony_beats:
        harmony_quality = random.choice(possible_harmony_qualities)
        root = melody[beat - 1]
        chord = Chord(root, harmony_quality)
        notes = random.sample(chord.notes, len(chord.notes))
        
        key_notes = Scale(k, tonality).notes
        
        for note in notes:
            for kn in key_notes:
                if note.letter == kn.letter:
                    note.accidental = kn.accidental

        good_notes = []
        for note in notes:
            note.octave = 4

            if compare(note, '>', lowest) and compare(note, '<', highest):
                if '##' in str(note) or 'bb' in str(note):
                    pass
                else:
                    good_notes.append(note)

            if len(good_notes) >= 2:
                beats.update({beat:(dur, harmony_quality, good_notes)})
                break

    tune.update({'beats': beats})
    tunes.append(tune)

sample = random.sample(tunes, 2000)
exceptions = []

start_id = 2
tune_id = start_id
for tune in tqdm(sample):
    try:
        tune_vals = (tune_id, tune['key'], tune['tonality'])
        tune_sql = 'INSERT INTO tunes(tune_id, tune_key, tonality) VALUES (%i, "%s", "%s")' % tune_vals
        
        cursor.execute(tune_sql)
    
        for mel_beat, mel_note in enumerate(tune['melody']):
            note_id = get_id(mel_note)
            
            melody_vals = (tune_id, note_id, mel_beat + 1)
            melody_sql = ('INSERT INTO melody_notes(tune_id, note_id, '
                          'beat_number, duration) '
                          'VALUES (%i, %i, %i, 1);' % melody_vals)
    
            cursor.execute(melody_sql)
    
        for harm_beat, (harm_dur, harm_qual, harm_notes) in tune['beats'].items():
            for harm_note in harm_notes:
                
          
                note_id = get_id(harm_note)
                harmony_vals = (tune_id, note_id, harm_beat, harm_dur)
                harmony_sql = ('INSERT INTO harmony_notes(tune_id, note_id, '
                               'beat_number, duration) '
                               'VALUES (%i, %i, %i, %i);' % harmony_vals)
    
                cursor.execute(harmony_sql)
    
                harm_details_sql = ('INSERT INTO harmony_details(tune_id, '
                                    'beat_number, tonality) '
                                    'VALUES (%i, %i, "%s")' % (tune_id, harm_beat, harm_qual))
    
                cursor.execute(harm_details_sql)
    except Exception as err:
        tune_sql = 'INSERT INTO tune_fails(tune_id, error_message) VALUES (%i, "%s")' % (tune_id, err)
    
    tune_id += 1
                
cnxn.commit()
cnxn.close()
