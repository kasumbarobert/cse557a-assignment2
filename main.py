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
import kml2geojson

import networkx as nx
from pyvis.network import Network
plt.rcParams['figure.figsize'] = [12, 12]

app = FastAPI()
app.mount("/static", StaticFiles(directory="assignment2"), name="static")

@app.get("/")
async def read_index():
    return FileResponse('index.html')

@app.get("/map/abila")
async def read_map():

	kml2geojson.main.convert('assignment2/Geospatial/Abila.kml', '')
    


