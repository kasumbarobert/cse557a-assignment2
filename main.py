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

	return [{"name":"Albert's Fine Clothing","lat":36.07525509787501, "long":24.859017589125003}, {"name":"Bean There Done That","lat":36.05529690397041, "long":24.873031178522627}, {"name":"Jack's Magical Beans","lat":36.0581978768805, "long":24.874065357478102}, {"name":"Katerina’s Café","lat":36.054794051033, "long":24.899048106087925}, {"name":"Abila Zacharo","lat":36.06223001360973, "long":24.85249313488776}, {"name":"Kronos Mart","lat":36.068538756842074, "long":24.879357855087722}, {"name":"Kalami Kafenion","lat":36.06519265032996, "long":24.854350932309654}, {"name":"Brew've Been Served","lat":36.05284725915184, "long":24.90028196879685}, {"name":"Coffee Cameleon","lat":36.05462998971543, "long":24.888348703821148}, {"name":"Frydos Autosupply n' More","lat":36.05629117447965, "long":24.90098900981899}, {"name":"Gelatogalore","lat":36.057854064595965, "long":24.85967636353537}, {"name":"Guy's Gyros","lat":36.056743099944704, "long":24.902282951659757}, {"name":"Hallowed Grounds","lat":36.062224527952296, "long":24.885493973339994}, {"name":"Shoppers' Delight","lat":36.05288581833333, "long":24.87105722791667}, {"name":"Frank's Fuel","lat":36.071394280645166, "long":24.84302106419355}, {"name":"General Grocer","lat":36.060368022564106, "long":24.859063282564108}, {"name":"Hippokampos","lat":36.07712665766563, "long":24.859441458769695}, {"name":"Ouzeri Elian","lat":36.05289996016472, "long":24.872009325082335}, {"name":"Brewed Awakenings","lat":36.06121102168282, "long":24.880156453236246}]

@app.get("/employees")
async def get_locations():
	employee_records = pd.read_csv("assignment2/car-assignments.csv")
	employee_records = employee_records.fillna('')
	return list(employee_records.to_dict(orient="index").values())


if __name__ == '__main__':
	uvicorn.run(app, host="127.0.0.1", port=8080)
