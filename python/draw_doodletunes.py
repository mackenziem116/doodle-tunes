#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Mar  5 13:31:49 2019

@author: mmackenzie
"""

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Feb 28 14:13:03 2019

@author: mmackenzie
"""

import p5
from database import Database
import pandas as pd
from scipy.interpolate import interp1d
from random import choice

db = Database()
w_scale = 10
h_scale = 100

pg = pd.read_csv('../data/music_images.csv')
beats = pg.row.unique()
notes = pg.column.unique()
pg.set_index(['row', 'column'], inplace=True)

query = "SELECT doodle_id, COUNT(*) as num_paths " \
        "FROM path_characteristics GROUP BY doodle_id"

table_rows = db.query(query)

dt = pd.DataFrame(table_rows, columns=['doodle_id', 'num_paths'])
doodle_ids = dt.doodle_id.tolist();
doodles = {d:n for d,n in zip(doodle_ids, dt.num_paths.tolist())}

query = "SELECT doodle_id, tune_id FROM doodles;"
doodle_tunes = dict(db.query(query))

res = 400

final_frame = pd.DataFrame(index=list(range(res)), columns=list(range(res)))
final_frame = final_frame.unstack();
final_frame = final_frame.reset_index()
final_frame.columns = ['row', 'column', 'none']
final_frame.drop('none', axis=1, inplace=True)
final_frame.set_index(['row', 'column'], inplace=True)

def setup():
    p5.size(2 * res, res)
    p5.background(240, 238, 225)

def draw():
    p5.no_loop()
    
def mouse_pressed():
    p5.background(240, 238, 225)
    d = choice(doodle_ids[2:])
    new_doodle(d)
    t = doodle_tunes[d]
    draw_midi(t)

def new_doodle(d):
    p5.background(240, 238, 225)

    n = doodles[d]

    query = "SELECT MIN(vertex_x) as 'left', " \
    			   "MAX(vertex_x) as 'right', " \
                   "MIN(vertex_y) as 'top', " \
                   "MAX(vertex_y) as 'bottom' " \
            "FROM path_verticies " \
            "WHERE doodle_id = '%s'" % d

    table_rows = db.query(query)
    outers = {k:v for k,v in zip(['left', 'right', 'top', 'bottom'], table_rows[0])}
    l, r, t, b = outers['left'], outers['right'], outers['top'], outers['bottom']
    
    x_interp = interp1d([l, r], [0, res])
    y_interp = interp1d([t, b], [0, res])

    for i in range(n):

        path_chars_columns =['doodle_id', 'path_number', 'color_r',
                             'color_g', 'color_b', 'stroke_weight']

        path_verts_columns =['doodle_id', 'path_number',
                             'vertex_number', 'vertex_x', 'vertex_y']

        query = "SELECT * FROM path_characteristics " \
                "WHERE doodle_id = '%s' AND path_number = %d" % (d, i)
        table_rows = db.query(query)
        path_chars = {k:v for k,v in zip(path_chars_columns, table_rows[0])}

        query = "SELECT * FROM path_verticies " \
                "WHERE doodle_id = '%s' AND path_number = %d" % (d, i)
        table_rows = db.query(query)
        path_verts = pd.DataFrame(table_rows, columns=path_verts_columns)

        p5.stroke(path_chars['color_r'],
                  path_chars['color_g'],
                  path_chars['color_b'])

        for i in range(path_verts.shape[0] - 1):

            row = path_verts.iloc[i]
            row_next = path_verts.iloc[i + 1]

            x = round(float(x_interp(row.vertex_x)), 2)
            y = round(float(y_interp(row.vertex_y)), 2)
            x_next = round(float(x_interp(row_next.vertex_x)), 2)
            y_next = round(float(y_interp(row_next.vertex_y)), 2)

            p5.line((x, y), (x_next, y_next))

def draw_midi(t):
    for i in notes:
        for j in beats:
            fill = pg.loc[(j, i), str(t)]
            if fill == '0':
                p5.fill(0)
                p5.stroke(0)
            else:
                r, g, b = [int(c) for c in eval(fill)]
                p5.fill(r, g, b)
                p5.stroke(r, g, b)
            p5.rect(((i * w_scale) + res, j * h_scale), w_scale, h_scale)

p5.run()
db.close();
