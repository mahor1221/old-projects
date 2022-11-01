#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
PyFingerprint
Copyright (C) 2015 Bastian Raschke <bastian.raschke@posteo.de>
All rights reserved.
"""

import hashlib
from pyfingerprint.pyfingerprint import PyFingerprint
import mysql.connector
from datetime import timedelta, datetime

# ========================================================================
# connect to database and create tables
try:
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="037arash",
        database="hozor"
    )
    print("connected to database")
    cursor = connection.cursor()

    # query = ("CREATE TABLE IF NOT EXISTS users_log "
    #          "(id int NOT NULL AUTO_INCREMENT, user_id int NOT NULL, "
    #          "first_auth datetime, seccond_auth datetime, PRIMARY KEY (id), "
    #          "FOREIGN KEY(user_id) REFERENCES users(id));")
    # result = cursor.execute(query)

except Exception as e:
    print('Could not connect to database')
    print('Exception message: ' + str(e))
    exit(1)


# ========================================================================
# Tries to initialize the sensor
try:
    f = PyFingerprint('/dev/ttyUSB0', 57600, 0xFFFFFFFF, 0x00000000)
    if (f.verifyPassword() == False):
        raise ValueError('The given fingerprint sensor password is wrong!')
    # Gets some sensor information
    print('Currently used templates: ' + str(f.getTemplateCount()) +
          '/' + str(f.getStorageCapacity()))
except Exception as e:
    print('The fingerprint sensor could not be initialized!')
    print('Exception message: ' + str(e))
    exit(1)

# ========================================================================
# Tries to search the finger and calculate hash
try:
    # Wait untill finger is read
    print('Waiting for finger...')
    while (f.readImage() == False):
        pass
    # Converts read image to characteristics and stores it in charbuffer 1
    f.convertImage(0x01)
    # Searchs template
    result = f.searchTemplate()
    positionNumber = result[0]
    accuracyScore = result[1]
    if (positionNumber == -1):
        print('No match found!')
        exit(0)
    print('Found template at position #' + str(positionNumber))
    print('The accuracy score is: ' + str(accuracyScore))

    # --------------------------------------------------------------------
    # Loads the found template to charbuffer 1
    f.loadTemplate(positionNumber, 0x01)
    # Downloads the characteristics of template loaded in charbuffer 1
    characterics = str(f.downloadCharacteristics(0x01)).encode('utf-8')
    # Hashes characteristics of template
    print('SHA-2 hash of template: ' + hashlib.sha256(characterics).hexdigest())

    # --------------------------------------------------------------------
    # logs user authentications
    query = "SELECT id FROM users WHERE f1='{0}' OR f1p='{0}' OR f2='{0}' OR f2p='{0}'".format(
        positionNumber)
    result = cursor.execute(query)
    records = cursor.fetchall()
    user_id = records[0][0]

    query = "SELECT * FROM users_log WHERE user_id='{}'".format(user_id)
    result = cursor.execute(query)
    records = cursor.fetchall()
    currentTime = datetime.now().replace(microsecond=0)  # + timedelta(1)

    # index
    log_id = 0
    user_id = 1
    first_auth = 2
    seccond_auth = 3

    newDay = False
    if not records:  # check if list is empty or not
        newDay = True
    else:
        lastRow = records[-1]
        if lastRow[first_auth].date() != currentTime.date():
            newDay = True
        elif lastRow[first_auth].date() == currentTime.date() and lastRow[seccond_auth] == None:
            query = ("UPDATE users_log "
                     "SET seccond_auth = '{}' WHERE id = {}").format(currentTime, lastRow[log_id])
            result = cursor.execute(query)
            print('Today seccond authentication')
        elif lastRow[first_auth].date() == currentTime.date() and lastRow[seccond_auth].date() == currentTime.date():
            print('Reached today maximum number of authentication')
            exit(0)

    if newDay:
        query = ("INSERT INTO users_log (user_id, first_auth) "
                 "VALUES ('{}', '{}')").format(user_id, currentTime)
        result = cursor.execute(query)
        print('Todat first authentication')

    # --------------------------------------------------------------------

except Exception as e:
    print('Operation failed!')
    print('Exception message: ' + str(e))
    exit(1)
finally:
    connection.commit()
    if (connection.is_connected()):
        cursor.close()
        connection.close()
        print("connection is closed\n")
