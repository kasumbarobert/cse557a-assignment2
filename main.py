# main.py

from fastapi import FastAPI

import pandas as pd
import numpy as np
from starlette.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from os.path import exists as file_exists
import uvicorn




app = FastAPI()
app.mount("/assignment2", StaticFiles(directory="assignment2"), name="static")
app.mount("/data", StaticFiles(directory="data"), name="static")

@app.get("/")
async def read_index():
    return FileResponse('index.html')
@app.get("/bizvis.html")
async def read_index():
    return FileResponse('bizvis.html')
@app.get("/style.css")
async def read_index():
    return FileResponse('style.css')
@app.get("/script.js")
async def read_index():
    return FileResponse('script.js')
	

@app.get("/locations")
async def get_locations():

	return [{"name":"Brew've Been Served","lat":36.060008078752446, "long":24.878457677814392}, {"name":"Hallowed Grounds","lat":36.060664984001114, "long":24.87858234644515}, {"name":"Coffee Cameleon","lat":36.06044472807339, "long":24.878937545860847}, {"name":"Abila Airport","lat":36.060466200785285, "long":24.87488757054914}, {"name":"Carlyle Chemical Inc.","lat":36.05814529903705, "long":24.87452038874074}, {"name":"Bean There Done That","lat":36.05659440572662, "long":24.873535473654034}, {"name":"Brewed Awakenings","lat":36.05636519737386, "long":24.873602285079365}, {"name":"Jack's Magical Beans","lat":36.05664367762605, "long":24.873794756126085}, {"name":"Hippokampos","lat":36.05976564699309, "long":24.875388508004296}, {"name":"Guy's Gyros","lat":36.061264090687835, "long":24.875020394628443}, {"name":"Abila Zacharo","lat":36.05846162030419, "long":24.872877864299284}, {"name":"Ouzeri Elian","lat":36.05987220782327, "long":24.875046510350447}, {"name":"Gelatogalore","lat":36.05685026796402, "long":24.873794079003822}, {"name":"Katerina’s Café","lat":36.06048018928097, "long":24.87595739320687}, {"name":"Kalami Kafenion","lat":36.058260077161165, "long":24.87412553298304}, {"name":"U-Pump","lat":36.060080143181814, "long":24.87574164982955}, {"name":"Frydos Autosupply n' More","lat":36.06808091030805, "long":24.87716006522923}, {"name":"Shoppers' Delight","lat":36.06362071915467, "long":24.884381652597938}, {"name":"Albert's Fine Clothing","lat":36.06253875458095, "long":24.883957689739884}, {"name":"Nationwide Refinery","lat":36.05881724443945, "long":24.869000476771323}, {"name":"Abila Scrapyard","lat":36.05067532822221, "long":24.888267997851855}, {"name":"Stewart and Sons Fabrication","lat":36.057471028583706, "long":24.87483347443489}, {"name":"Frank's Fuel","lat":36.05867679168921, "long":24.87739165777028}, {"name":"Chostus Hotel","lat":36.062430107889725, "long":24.87539602287771}, {"name":"Kronos Pipe and Irrigation","lat":36.05609774840491, "long":24.88105156073618}, {"name":"General Grocer","lat":36.0701850860204, "long":24.87480295096939}, {"name":"Octavio's Office Supplies","lat":36.052803207906976, "long":24.876481884651163}, {"name":"Desafio Golf Course","lat":36.07002135144301, "long":24.871924781949375}, {"name":"Kronos Mart","lat":36.05756353443674, "long":24.88154461009291}, {"name":"Roberts and Sons","lat":36.06935443690322, "long":24.871011073161288}, {"name":"Ahaggo Museum","lat":36.05571086166667, "long":24.8965573875}]

@app.get("/employees")
async def get_locations():
	employee_records = pd.read_csv("assignment2/car-assignments.csv")
	employee_records = employee_records.fillna('')
	return list(employee_records.to_dict(orient="index").values())


if __name__ == '__main__':
	uvicorn.run(app, host="127.0.0.1", port=8080)