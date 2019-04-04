#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Mar 22 11:05:42 2019

@author: mmackenzie
"""
from database import Database

q = ('SELECT color_r, color_g, color_b '
     'FROM path_characteristics '
     'GROUP BY color_r, color_g, color_b '
     'ORDER BY color_r, color_g, color_b')

db = Database()
t = db.query(q)
print(t)


