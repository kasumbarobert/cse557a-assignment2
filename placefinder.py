 


import csv
import pandas as pd
import codecs


from datetime import datetime


import numpy as np


class Person() :

    movements = [] # timestamp, gps
    purchases = [] # timestamp, place name

    def __init__(self, last, first, carid):
        self.last = last
        self.first = first
        self.carid = carid


    def associate(self) :
        
        associations = []
        asdict = {}

        for purchase in self.purchases :

            timedate = purchase[0]
            
            for movement in self.movements :

                movement_td = movement[0]

                difference = movement_td - timedate

                minutes_difference = difference.total_seconds()/60

                #if abs(minutes_difference) <= 0 :
                
                if timedate == movement_td:

                    store = purchase[1]
                    latlong = movement[1]

                    if store in asdict:
                        asdict[store].append(latlong)
                    else:
                        asdict[store] = [latlong]

                    #associations.append( [purchase[1], movement[1],movement_td, timedate ] )

        #return associations
        return asdict 


                    



def make_people(filename):
    file = open(filename)
    csvreader = csv.reader(file)

    # Extract the headers to get them out of the way
    header = []
    header = next(csvreader)

    # Extract the rows
    rows = []
    for row in csvreader:
        rows.append(row)

    file.close()

    
    # Convert the rows to people
    
    people = []
    
    for row in rows:
        last = row[0].strip()
        first = row[1].strip()
        carid = 0 # NOTE: A carid of 0 indicates a trucker
        if row[2] != '':
            carid = int(row[2])
        
        person = Person(last, first, carid )
        people.append(person)

    
    return people


def load_payments(filename, topeople) :

    #df = pd.read_csv(filename)
    #print(df)

    

    file = open(filename, encoding='cp1252')
    csvreader = csv.reader(file)

    # Extract the headers to get them out of the way
    header = []
    header = next(csvreader)

    # Extract the rows
    rows = []
    for row in csvreader:
        rows.append(row)

    file.close()

    for row in rows :
        timestamp = datetime.strptime(row[0].strip(),'%m/%d/%Y %H:%M')
        location_name = row[1].strip()
        first = row[3].strip()
        last = row[4].strip()

        for person in topeople :
            if first == person.first and last == person.last :
                person.purchases.append([timestamp, location_name])

    return topeople


def load_gps(filename, topeople) :
    file = open(filename)
    csvreader = csv.reader(file)

    # Extract the headers to get them out of the way
    header = []
    header = next(csvreader)

    # Extract the rows
    rows = []
    for row in csvreader:
        rows.append(row)

    file.close()

    for row in rows :
        timestamp = datetime.strptime(row[0].strip(),'%m/%d/%y %H:%M')
        vic_id = int(row[1])
        lat = float(row[2])
        lon = float(row[3])



        for person in topeople :
            if vic_id == person.carid :
                person.movements.append([timestamp, (lat, lon) ])

    return topeople

        

def average_over_dict(dic) :
    retd = {}
    for key in dic :
        value = dic[key]
        runningt0 = 0.0
        runningt1 = 0.0

        for latlong in value :
            runningt0 += latlong[0]
            runningt1 += latlong[1]

        runningt0/=len(value)
        runningt1/=len(value)

        retd[key] = (runningt0, runningt1)
    return retd

def format_avg_dict(dic) :
    retstring = ""
    for key in dic :
        value = dic[key]
        retstring += "{\"name\":\"" + key + "\",\"lat\":" + str(value[0]) + ", \"long\":" + str(value[1]) + "}, "
                                                                                           
    return retstring
                                                                                           


def main():
    
    people = make_people("assignment2/car-assignments.csv")

    load_payments("assignment2/cc_data.csv", people)

    load_gps("assignment2/gps.csv", people)

    association_dict = people[31].associate()

    avgs = average_over_dict(association_dict)
    print(format_avg_dict(avgs))

    

    # print(people[31].associate())

    

    #all_associations = np.array()

    # for person in people :
        
    #     associations = np.array(person.associate())
        
    #     #all_associations = numpy.append(all_associations, associations, axis=0)
        
    #     np.savetxt(str(person.carid) + ".csv", associations, delimiter=',')

    #     print(person.carid)
        # print(person.last)
        # print(person.first)
        # print(person.associate)


    #np.savetxt("all_associations.csv", associations, delimiter=',')
            


if __name__ == "__main__":
    main()

