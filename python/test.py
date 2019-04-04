#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Feb 28 16:06:40 2019

@author: mmackenzie
"""

from p5 import createShape, size 

s = createShape()


def setup():
    size(640, 360)


def draw():
    background(0)

    fill(100)
    s.beginShape()
    s.vertex(Vector(10,10))
    s.vertex(10,100)
    s.vertex(100, 100)
    s.vertex(100, 10)
    s.endShape(CLOSE)
    s.setVertex(2, (100 + (millis()//10)% 500), 100)
#    s.setVertex(2, random_uniform(100,600), random_uniform(100,300))
#    s.setVertex(2, mouse_x if mouse_x>100 else 100, mouse_y if mouse_y>100 else 100)
    print(s.getVertex(2))
    s.shape()


if __name__ == '__main__':
    run()