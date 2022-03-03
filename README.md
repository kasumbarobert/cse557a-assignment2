 2/16/21

# Project Setup:

This project requires installation of the FastAPI, uvicorn and starlette packages in python. They can be installed using 
1. **pip install fastapi**
2. **pip install uvicorn**
3. **pip install starlette**

We also used a server-client architecture with the python running as the server end and JS/HTML/d3 on the front end. To run, open a terminal and run the main file to start the server. You can use the command **python3 -m main.py** from the terminal

Next, go to your browser and type in **127.0.0.1:8080**

# Notes 
For M2 - Python code was written in order to separate out each day's worth of purchases from both the credit card csv and the loyalty data csv. We aggregated the revenue information for each business on a particular day as well as the number of purchases that were made on that day in each csv.  

This main pages shows a simple bar chart that visualizes the credit card earnings of each business each day, and you can toggle between whether you're viewing the revenue information or the frequency of visits. The main page also shows a map with focused to the Abila. We have so far added the places that have been visited by employees at GasTech. Currently only the selections of **date** and the **perfomance metric** will show effect.

After making this initial bar chart, it's become clear that a change of direction or further visualizations are necessary in order to glean meaningful information from the purchases. For the final submission/pre-writeup, we are considering taking the following steps:

1. Add in a type dropdown for the type of business that's on display. Abila Airport is always going to make thousands more dollars in a given day than Brew've Been Served, so filtering by business is necessary to keep an even playing field and see if any particular businesses in a categoray are being utilized more than others.
2. Clean up the x-axis to be more readable - doing part 1 should also help with the concentration of businesses in the bar chart.
3. Add a hover or tooltip or maybe another visualization that deescribes who the all-time/daily/weekly highest-spenders/visitors are. We're trying to learn more about who may be involved with the kidnapping and visualizing the information about these business's earnings isn't going to tell us much in a vacuum. 
4. Make the visualizations more presentable 
5. If we continue down this route, add in the second bar visualization for the loyalty data and see if we can draw comparisons.

For the map, we also intend to add the following:

1. Showing the route taken by a single employee or employees in a given department on a given date as selected by the user.
2. Show the most popular places that employees visited

All of these should be quite doable and will give us a holistic view on what's going on.
