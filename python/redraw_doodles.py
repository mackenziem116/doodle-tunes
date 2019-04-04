#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Feb 28 14:13:03 2019

@author: mmackenzie
"""

import p5
import mysql.connector
import pandas as pd
from random import randint

cnxn = mysql.connector.connect(
    user='admin',
    password='R3bingst',
    database='doodletunes',
    unix_socket="/cloudsql/nice-compass-230720:us-east1:doodletunes-db"
)

query = "SELECT doodle_id, COUNT(*) as num_paths " \
        "FROM path_characteristics GROUP BY doodle_id"
      
cursor = cnxn.cursor()
cursor.execute(query)

table_rows = cursor.fetchall()
dt = pd.DataFrame(table_rows, columns=['doodle_id', 'num_paths'])
doodle_ids = dt.doodle_id.tolist();
doodles = {d:n for d,n in zip(doodle_ids, dt.num_paths.tolist())}


def setup():
    p5.size(800, 800)

def draw():
    pass

def mouse_pressed():
    new_doodle();
    

def new_doodle():
    p5.background(240, 238, 225)
    
    d = doodle_ids[randint(0, len(doodle_ids) - 1)]
    n = doodles[d]
    
    for i in range(n):
        
        path_chars_columns =['doodle_id', 'path_number', 'color_r', 
                             'color_g', 'color_b', 'stroke_weight']
        
        path_verts_columns =['doodle_id', 'path_number', 
                             'vertex_number', 'vertex_x', 'vertex_y']
         
        query = "SELECT * FROM path_characteristics " \
                "WHERE doodle_id = '%s' AND path_number = %d" % (d, i)
        cursor.execute(query)
        table_rows = cursor.fetchall()
        path_chars = {k:v for k,v in zip(path_chars_columns, table_rows[0])}
        
        query = "SELECT * FROM path_verticies " \
                "WHERE doodle_id = '%s' AND path_number = %d" % (d, i)
        cursor.execute(query)
        table_rows = cursor.fetchall()
        path_verts = pd.DataFrame(table_rows, columns=path_verts_columns)
        
        p5.stroke(path_chars['color_r'], 
                  path_chars['color_g'], 
                  path_chars['color_b'])
        
        
#        p5.stroke_weight(path_chars['stroke_weight'])
        for i in range(path_verts.shape[0] - 1):
            
            row = path_verts.iloc[i]
            row_next = path_verts.iloc[i + 1]
            
            x = round(row.vertex_x, 2)
            y = round(row.vertex_y, 2)
            x_next = round(row_next.vertex_x, 2)
            y_next = round(row_next.vertex_y, 2)
            
            p5.line((x, y), (x_next, y_next))

p5.run()
cnxn.close();


