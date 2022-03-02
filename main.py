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

	return [{"name":"Jack's Magical Beans","lat":36.0583347012157, "long":24.874158431882368}, {"name":"Gelatogalore","lat":36.058147206333345, "long":24.858974806000003}, {"name":"Coffee Cameleon","lat":36.05466310833333, "long":24.889133250833336}, {"name":"Kronos Mart","lat":36.06322208900001, "long":24.89077744366667}, {"name":"Hallowed Grounds","lat":36.06225245885714, "long":24.885627821714287}, {"name":"Hippokampos","lat":36.0766503974359, "long":24.86008522871795}, {"name":"Bean There Done That","lat":36.055333583580925, "long":24.872992037931045}, {"name":"Guy's Gyros","lat":36.05735849827587, "long":24.902151192068953}, {"name":"Abila Zacharo","lat":36.06220049055555, "long":24.852475762777775}, {"name":"Brewed Awakenings","lat":36.06147391814815, "long":24.88151016212963}]

@app.get("/employees")
async def get_locations():
	employee_records = pd.read_csv("assignment2/car-assignments.csv")
	employee_records = employee_records.fillna('')
	return list(employee_records.to_dict(orient="index").values())


if __name__ == '__main__':
	uvicorn.run(app, host="127.0.0.1", port=8080)
