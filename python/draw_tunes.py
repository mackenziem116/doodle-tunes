#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Mar  4 16:06:45 2019

@author: mmackenzie
"""

import pandas as pd
import p5

class Count:
    count = 1

pg = pd.read_csv('../data/music_images.csv')
beats = pg.row.unique()
notes = pg.column.unique()
pg.set_index(['row', 'column'], inplace=True)

w_scale = 10
h_scale = 80

def setup():
    p5.size(len(notes) * w_scale, len(beats) * h_scale)
    
def draw():
    p5.background(0)
    p5.no_loop()

def mouse_pressed():
    t = Count.count
    draw_midi(t)
    Count.count += 1

def draw_midi(t):
    for i in notes:
        for j in beats:
            fill = pg.loc[(j, i), str(t)]
            if fill == '0':
                p5.fill(0)
            else:
                r, g, b = [int(c) for c in eval(fill)]
                p5.fill(r, g, b)
            p5.rect((i * w_scale, j * h_scale), w_scale, h_scale)
            
p5.run()