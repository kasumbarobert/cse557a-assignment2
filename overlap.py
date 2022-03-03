 

import csv
import pandas as pd
import codecs
from datetime import datetime
import numpy as np
import json


adjmatrix = {}
timeinterval = 10

def add_connection(person1first, person1last, person2first, person2last) :
    #TODO: Process Person1
    #TODO: Process Person2
    person1 = person1first + " " + person1last
    person2 = person2first + " " + person2last

    # Add the person2 to the person1 matrix spot
    if person1 in adjmatrix:
        if person2 in adjmatrix[person1] :
            adjmatrix[person1][person2] += 1
        else :
            adjmatrix[person1][person2] = 1
    else :
        adjmatrix[person1] = {person2 : 1}

    # Add the person1 to the person2 matrix spot
    if person2 in adjmatrix:
        if person1 in adjmatrix[person2] :
            adjmatrix[person2][person1] += 1
        else :
            adjmatrix[person2][person1] = 1
    else :
        adjmatrix[person2] = {person1 : 1}


# Go down the list in order of time

file = open("assignment2/cc_data.csv", encoding='cp1252')
csvreader = csv.reader(file)
# Extract the headers to get them out of the way
header = []
header = next(csvreader)
# Extract the rows
rows = []
for row in csvreader:
    rows.append(row)
file.close()

for i in range(len(rows)):
    row = rows[i]
    # If the last time and this time are within timeinterval
    timestamp = datetime.strptime(row[0].strip(),'%m/%d/%Y %H:%M')
    location_name = row[1].strip()
    person1first = row[3].strip()
    person1last = row[4].strip()


    checknext = True
    nextone = 1
    while checknext :

        if i+nextone >= len(rows):
            break
        
        nextrow = rows[i+nextone]
        
        
        nexttime = datetime.strptime(row[0].strip(),'%m/%d/%Y %H:%M')
        difference = nexttime - timestamp
        minutes_difference = difference.total_seconds()/60

        if minutes_difference > timeinterval :
            checknext = false
            break

        # Check if the loc name is the same
        this_place_name = nextrow[1].strip()
        if this_place_name == location_name :

            # Now it is confirmed same time, same place
            person2first = nextrow[3].strip()
            person2last = nextrow[4].strip()

            add_connection(person1first, person1last, person2first, person2last)
        
            
        nextone += 1



    
#print(adjmatrix)




# Convert the adjacency matrix to a JSON output

def get_department(name) :
    file = open("assignment2/car-assignments.csv", encoding='cp1252')
    csvreader = csv.reader(file)
    # Extract the headers to get them out of the way
    header = []
    header = next(csvreader)
    # Extract the rows
    rows = []
    for row in csvreader:
        rows.append(row)
    file.close()

    department = "Employment Unknown"
    title = ""
    for row in rows :
        if row[1].strip() + " " + row[0].strip() == name :
            department = row[3]
            title = row[4]
            break

    return department, title

def get_color_for_department(department) :
    department_colors = {
        "Information Technology" : "#EE4B28",
        "Engineering" : "#288DEE",
        "Executive" : "#28EEE4",
        "Security" : "#E628EE",
        "Facilities" : "#E0EE28",
        }
    if department in department_colors : 
        return department_colors[department]
    else:
        return '#E5E5E5'
            

    
peopledicts = []

for person in adjmatrix :
    department, title = get_department(person)
    color = get_color_for_department(department)
    individualdict = { "name" : person,
                       "color" : color,
                       "department" : department,
                       "title" : title }
    peopledicts.append(individualdict)

linksdicts = []

alreadydone = []

for person in adjmatrix :
    alreadydone.append(person)
    for toperson in adjmatrix[person] :
        if toperson not in alreadydone :
            value = adjmatrix[person][toperson]
            outdict = {"value" : value,
                       "source" : person,
                       "target" : toperson
                       }
            linksdicts.append(outdict)

ret = {"nodes" : peopledicts,
       "links" : linksdicts }


with open("sample.json", "w") as outfile:
    json.dump(ret, outfile)

print(ret)


# If the last place and this place are the same
#
# Link the two people
#

# TODO: NEED TO MAKE IT SO THERE CAN BE 3 WAY CONNECTIONS
# KEEP GOING DOWN UNTIL YOU ARE PAST THE TIME INTERVAL

