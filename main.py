# main.py

from fastapi import FastAPI
import os
import pandas as pd 
import numpy as np
import math
import matplotlib.pyplot as plt
import re
import pickle
from dateutil.parser import parse
from starlette.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from os.path import exists as file_exists
from pykml import parser


plt.rcParams['figure.figsize'] = [12, 12]

app = FastAPI()
app.mount("/static", StaticFiles(directory="assignment2"), name="static")

@app.get("/")
async def read_index():
    return FileResponse('index.html')

@app.get("/locations")
async def get_locations():

	return [{"name":"Gyro's place","lat":36.06921504029343, "long":24.86214637756348},
	{"name":"Coffee Shop","lat":36.07961504029343, "long":24.86734657756348},
	{"name":"GasTech HQ","lat":36.07978504029343, "long":24.83734657756348},
	{"name":"Temporary","lat":36.07161504029343, "long":24.83734657756348},
	{"name":"Abila Airport","lat":36.04978504029343, "long":24.89734657756348}]

	
    


