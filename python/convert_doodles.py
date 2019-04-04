#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Feb 28 14:13:03 2019

@author: mmackenzie
"""

import sys
import p5
import pandas as pd
from scipy.interpolate import interp1d

from database import Database

# count as a static value
class Count:
    count = -1

# create database connection and set resolution of pics
res = 28
db = Database()

# get doodle ids and num of paths in each doodle
query = "SELECT doodle_id, COUNT(*) as num_paths " \
        "FROM path_characteristics GROUP BY doodle_id"

table_rows = db.query(query)
dt = pd.DataFrame(table_rows, columns=['doodle_id', 'num_paths'])
doodle_ids = dt.doodle_id.tolist();
doodles = {d:n for d,n in zip(doodle_ids, dt.num_paths.tolist())}

# create the final dataframe that values will be appended to
final_frame = pd.DataFrame(index=list(range(res)), columns=list(range(res)))
final_frame = final_frame.unstack();
final_frame = final_frame.reset_index()
final_frame.columns = ['row', 'column', 'none']
final_frame.drop('none', axis=1, inplace=True)
final_frame.set_index(['row', 'column'], inplace=True)

# setup
def setup():
    p5.size(res, res)
    p5.background(240, 238, 225)

# draw doodle, get pixel values, update final frame
def draw():
    p5.background(240, 238, 225)
    count = Count.count
    d = new_doodle(count)
    print(count, d)
    
    pixels = p5.sketch.renderer.fbuffer.read(mode='color', alpha=False)
    final_frame[d] = None
    for i in range(res):
        for j in range(res):
            final_frame.loc[(i, j), d] = pixels[i, j]

    if count == (len(doodle_ids) - 1):
        final_frame.drop(final_frame.columns[0], axis=1, inplace=True)
        final_frame.to_csv('../data/doodle_images.csv')
        sys.exit()
    
    Count.count += 1

# get doodle and draw paths
def new_doodle(i):
    p5.background(240, 238, 225)

    d = doodle_ids[i]
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

#        p5.stroke_weight(path_chars['stroke_weight'])
        for i in range(path_verts.shape[0] - 1):

            row = path_verts.iloc[i]
            row_next = path_verts.iloc[i + 1]

            x = round(float(x_interp(row.vertex_x)), 2)
            y = round(float(y_interp(row.vertex_y)), 2)
            x_next = round(float(x_interp(row_next.vertex_x)), 2)
            y_next = round(float(y_interp(row_next.vertex_y)), 2)

            p5.line((x, y), (x_next, y_next))
        
    return d

p5.run()
db.close();
