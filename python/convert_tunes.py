#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Mar  4 10:00:15 2019

@author: mmackenzie
"""

from database import Database
import pandas as pd
from tqdm import tqdm

db = Database()

query = "SELECT tune_id, tonality " \
        "FROM tunes"
table_rows = db.query(query)
tunes = pd.DataFrame(table_rows, columns=['tune_id', 'tonality'])
tune_ids = tunes.tune_id.tolist();

query = "SELECT note_id, note_name, note_octave FROM notes"
table_rows = db.query(query)
notes = pd.DataFrame(table_rows, columns=['note_id', 'note_name', 'note_octave'])

def get_tune(i):
    with open('tune_query.txt', 'r') as f:
        query = f.read()
    
    table_rows = db.query(query % i)
    columns=['tune_id', 'note_id', 'beat_number', 'duration', 'stem', 'tonality']
    tune = pd.DataFrame(table_rows, columns=columns)
    
    return tune

colors = {
            'major': (255, 255, 0),
            'natural_minor': (0, 0, 255),
            'harmonic_minor': (127, 0, 255), 
            'major_pentatonic': (255, 0, 0),
            'maj': (0, 255, 0),
            'min':(255, 128, 0),
             None: (255, 255, 255)
        }

pixel_grid = pd.DataFrame(columns=list(range(4)), 
                          index=list(range(notes.note_id.max())))

pixel_grid = pixel_grid.unstack()
pixel_grid = pixel_grid.reset_index()
pixel_grid.columns = ['row', 'column', 'none']
pixel_grid.drop('none', axis=1, inplace=True)
pixel_grid.set_index(['row', 'column'], inplace=True)

for tune_id in tqdm(tune_ids):
    tune = get_tune(tune_id)
    tonality = tunes[tunes.tune_id == tune_id].tonality.values[0]
    pixel_grid[tune_id] = None
    
    for row in tune.itertuples(name='Sound'):
        j = row.note_id - 1
        i = row.beat_number - 1
        if row.stem == 0:
            value = colors[tonality]
        else: 
            value = colors[row.tonality]
        
        pixel_grid.loc[(i, j), tune_id] = value
        
        if row.duration == 2:
            pixel_grid.loc[(i + 1, j), tune_id] = value

pixel_grid.fillna(0, inplace=True)
pixel_grid.to_csv('../data/music_images.csv')

db.close()