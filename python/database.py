#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Mar 22 11:06:21 2019

@author: mmackenzie
"""
import mysql.connector

class Database:
    
    def __init__(self):
        self.__create_cnxn()
    
    def __create_cnxn(self):
        self.__cnxn = mysql.connector.connect(
            user='admin',
            password='R3bingst',
            database='doodletunes',
            unix_socket="/cloudsql/nice-compass-230720:us-east1:doodletunes-db"
        )
    
    def query(self, query):
        cursor = self.__cnxn.cursor()
        cursor.execute(query)

        return cursor.fetchall()
    
    def close(self):
        self.__cnxn.close()
        
    