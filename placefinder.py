


import csv
import pandas as pd
import codecs


from datetime import datetime


import numpy as np


timedel = 0

class Person :

    # self.movements = [] # timestamp, gps
    # self.purchases = [] # timestamp, place name

    def __init__(self, last, first, carid):
        self.last = last
        self.first = first
        self.carid = carid
        self.movements = []
        self.purchases = []

    def __str__(self):
        return self.first + self.last + " carID:" + str(self.carid) + " /n Movements: " + str(self.movements) + " /n Purchases: " + str(self.purchases) + " /n ------------"


    def associate(self) :

        associations = []
        asdict = {}

        for purchase in self.purchases :

            timedate = purchase[0]

            for movement in self.movements :

                movement_td = movement[0]

                difference = movement_td - timedate

                minutes_difference = difference.total_seconds()/60

                if abs(minutes_difference) <= timedel :

                # if timedate == movement_td:

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

    # debugint = 0
    for row in rows :
        timestamp = datetime.strptime(row[0].strip(),'%m/%d/%Y %H:%M')
        location_name = row[1].strip()
        first = row[3].strip()
        last = row[4].strip()

        for person in topeople :

            if first == person.first and last == person.last :
                # print(first + "==" + person.first)
                # print(person)
                person.purchases.append([timestamp, location_name])
                continue

        # debugint += 1
        # if debugint > 10:
        #     for person in topeople:
        #         print(person)
        #     quit()

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
                break

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

def combine_all(alldicts) :
    def get_keys(ad):
        keys = set([])
        for dict in ad :
            for key in dict.keys() :
                keys.add(key)
        return keys

    allkeys = get_keys(alldicts)
    ret = {}
    for key in allkeys :
        ret[key] = []

    for dict in alldicts :
        for key in dict :
            ret[key].extend(dict[key])

    return ret


# def tojson(avgs) :
#     retstring = ""
#     for key in avgs :
#         locationX, locationY = avgs[key]
#
#         {"name":"Brew've Been Served","lat":36.060008078752446, "long":24.878457677814392},


def main():

    people = make_people("assignment2/car-assignments.csv")

    load_payments("assignment2/cc_data.csv", people)

    load_gps("assignment2/gps.csv", people)

    #print(people[18].last)

    association_dict = people[18].associate() #31


    avgs = average_over_dict(association_dict)
    #print(format_avg_dict(avgs))


    # Do it for everyone now
    alldicts = []
    for person in people :
        alldicts.append(person.associate())

    combined = combine_all(alldicts)

    print(combined)

    averages = average_over_dict(combined)

    print(averages)

    print(format_avg_dict(averages))





    # print(people[18].movements)
    # print(people[18].pruchases)
    #
    # print("____")
    # print(people[17].movements)
    # print(people[17].pruchases)



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
