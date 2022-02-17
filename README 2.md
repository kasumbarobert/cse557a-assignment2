2/16/21

This project requires installation of the FastAPI and the uvicorn package in python.

They can be installed using 
pip install fastapi
pip install uvicorn



To run, open a terminal and run a python 3 server. You can use the command python -m main.py

Next, go to your browser and type in 127.0.0.1:8080

For M2 - Python code was written in order to separate out each day's worth of purchases from both the credit card csv and the loyalty data csv. We aggregated the revenue information for each business on a particular day as well as the number of purchases that were made on that day in each csv. 

This index.html/js file includes a simple bar chart that visualizes the credit card earnings of each business each day, and you can toggle between whether you're viewing the revenue information or the frequency of visits. The main page also shows a map with focused to the Abila. We have so far added the places that have been visited by employees at GasTech

After making this initial bar chart, it's become clear that a change of direction or further visualizations are necessary in order to glean meaningful information from the purchases. For the final submission/pre-writeup, we are considering taking the following steps:

1. Add in a type dropdown for the type of business that's on display. Abila Airport is always going to make thousands more dollars in a given day than Brew've Been Served, so filtering by business is necessary to keep an even playing field and see if any particular businesses in a categoray are being utilized more than others.
2. Clean up the x-axis to be more readable - doing part 1 should also help with the concentration of businesses in the bar chart.
3. Add a hover or tooltip or maybe another visualization that deescribes who the all-time/daily/weekly highest-spenders/visitors are. We're trying to learn more about who may be involved with the kidnapping and visualizing the information about these business's earnings isn't going to tell us much in a vacuum. 
4. Make the visualizations more presentable 
5. If we continue down this route, add in the second bar visualization for the loyalty data and see if we can draw comparisons.

All of these should be quite doable and in conjunction with the map portion we've built, should give us a holistic view ono what's going on.