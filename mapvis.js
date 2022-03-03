//this file has the code fo visualizing the map and is based of the Leaflet.js libray

var location_by_minute = null
var map  = null
var all_employees_ids = null
var all_employees = null
var map_colors = ["#696969","#a0522d","#006400","#8b0000","#808000","#483d8b","#3cb371","#008080","#4682b4","#9acd32","#00008b","#32cd32","#daa520","#7f007f","#8fbc8f","#9932cc","#ff0000","#00ced1","#ff8c00","#c71585","#00ff00","#e9967a","#dc143c",
"#00bfff","#0000ff","#adff2f","#da70d6","#ff7f50","#ff00ff","#1e90ff","#db7093","#f0e68c","#ffff54","#dda0dd","#add8e6","#7b68ee","#98fb98","#7fffd4","#ffe4c4","#ffc0cb"]
var all_employees_ids_layer_group = []
var single_employee_layer_group = []
var abila_layer_group = []
var department_employees_layer =[]

all_employees_ids_layer_group = L.layerGroup()
single_employee_layer_group = L.layerGroup()
department_employees_layer = L.layerGroup()


//load location data accurate to one minute
d3.csv("data/locations_by_minute.csv").then(function (locationData){
    location_by_minute = locationData
})

// read the car assignment dat
d3.csv("assignment2/car-assignments.csv").then(function(employees) {
        //extract the unique car Ids
        all_employees_ids = employees.map(function(emp){
            return emp.CarID 
        })
        all_employees_ids = all_employees_ids.filter(Boolean)
        all_employees = employees
        //populate the employees list dropdown list with the option value as the car ID
        var options = d3.select("#employees_list").selectAll("option")
            .data(employees).enter().append("option");
            options.text(function(d) {
                return d.FirstName+" "+d.LastName;
            })
            .attr("value", function(d) {
                return d.CarID;
            });
        //add the default "All employees option"
        d3.select("#employees_list").insert("option",":first-child")
            .text("All employees").attr("value","all").attr("selected","selected")
        
        //populate the departments into the departments dropdown
        d3.select("#departments_list").selectAll("option")
            .data([...new Set(d3.map(employees, function(emp){return emp.CurrentEmploymentType;}))])
            .enter()
            .append("option").text(function(d){return d;}).attr("value",function(d){return d;});
        d3.select("#departments_list").insert("option",":first-child").text("Choose departments").attr("selected","selected")
        updateRoutes()
}).catch(function(err) {
        console.log(err)
})


//instantiate a map centered at 36.068421504029343 , 24.86214637756348
map = L.map('map', {
    center: [36.068421504029343 , 24.86214637756348],
    zoom: 13.5
})

//add zoom +/- buttons
var svg = d3.select(map.getPanes().overlayPane).append("svg"),
g = svg.append("g").attr("class", "leaflet-zoom-hide");

///load the map of Kronos and add it to the main map as a layer
var kmz = L.kmzLayer().addTo(map);
kmz.load("assignment2/Geospatial/Kronos Island.kmz")

//load the map of Abila
abila_layer_group = new L.KML("assignment2/Geospatial/Abila.kml");
map.addLayer(abila_layer_group);

// load the locations of the business that the employees visited
d3.json("data/business_locations.json").then(function(locations){
    //add a pin for each business
    for (let x in locations) {
        L.marker([locations[x].lat , locations[x].long])
            .bindTooltip(locations[x].name, 
            {
                direction: 'right',
                riseOnHover: true
            }
        ).addTo(map);
    }
    //change the color of the paths in the abila map
    abila_layer_group.setStyle({color: '#eeeeee', "weight":0.2})
})

// update the routes map when a new employee is selected
d3.select("#employees_list").on("change", function(){
    updateRoutes()
    displayEmployeeDetails()

});
// update the routes map when a new department is selected
d3.select("#departments_list").on("change", function(){
    displayRoutesFromDept()
});
// update the routes map when a new date is selected
d3.select("#date").on("change", function(){
    updateRoutes()
});
// update the routes map when the start time is changed
d3.select("#start_time").on("change", function(){
    updateRoutes()
});
// update the routes map when the end time is changed
d3.select("#end_time").on("change", function(){
    updateRoutes()
});

function displayEmployeeDetails(){
    //capture the employee list selection
    carId = document.getElementById('employees_list').value
    i = carId

    
    var employee_details_div =  d3.select("#employee_details")
    employee_details_div.selectAll("p").remove()
    if (carId != "all"){
        employee_details_div.append("p").attr("class","col-12")
        .text("Name: "+all_employees[i-1].FirstName +" "+all_employees[i-1].LastName)
        employee_details_div.append("p").attr("class","col-12")
        .text(" Title: "+all_employees[i-1].CurrentEmploymentType)
    }
}
// function to update routes when the employee or date or time selection changes
function updateRoutes(){
    //capture the employee list selection
    carId = document.getElementById('employees_list').value
    //capture the date
    date = document.getElementById('date').value
    //capture the start and end times
    start_time = date+" "+document.getElementById('start_time').value
    end_time = date+" "+document.getElementById('end_time').value

    // display routes if "all employees" is selected
    if (carId =="all"){
        displayALlRoutes(start_time, end_time) // displays all employee routes greyed
        //reset the map layers to avoid overlapp
        single_employee_layer_group.clearLayers()
        department_employees_layer.clearLayers()
    }
    else{
        displayALlRoutes(start_time, end_time) // displays all employee routes greyed
        
        //reset the map layers to avoid overlapp
        department_employees_layer.clearLayers()
        single_employee_layer_group.clearLayers()

        //create JS date objects for easy comparison 
        loc_start_time = new Date(start_time)
        loc_end_time = new Date(end_time)

        //filter the gps data matching the current datetime filter criteria 
        var carLocations = location_by_minute.filter(function(location){
            gps_date_time = new Date(location.Timestamp)
            return location.id == carId && (gps_date_time>=loc_start_time && gps_date_time<=loc_end_time);
        });
        
        //extract the latitudes and longtitudes
        var latlngs = carLocations.map(function(loc){return [loc.lat,loc.long]}); 
        //create a path using the coordinates
        var path = L.polyline(latlngs, {"delay":400,"weight":3,"color":map_colors[carId],"paused":true,"reverse":true, "id":carId})
        i = carId
        //add popup to when the user clicks
        path.bindPopup("<span style='color:"+map_colors[carId]+"'>"+all_employees[i-1].FirstName +" "+all_employees[i-1].LastName+"</span>",{
                direction: 'auto',
                color:map_colors[carId]
        })
        //bolden the path when a user hoovers over it
        path.on("mouseover", function(e){
            this.setStyle({ "weight":5})
            
        })
         //unbolden the path when the mouse leaves 
        path.on("mouseout", function(e){
            this.setStyle({ "weight":3})
            //map.closePopup()
        })
        //add path to the layer
        single_employee_layer_group.addLayer(path)
       //add a red and blue marker to indicate where the path starts and ends respectively
        single_employee_layer_group.addLayer( L.circleMarker(latlngs[0],{color:"red",radius:7}))
        single_employee_layer_group.addLayer( L.circleMarker(latlngs[latlngs.length-1],{color:"blue",radius:7}))
        
        //add layer to map
        single_employee_layer_group.addTo(map);
    }
    
    
}
// function to update routes when the department changes
function displayRoutesFromDept(){
        //capture the department
        department = document.getElementById('departments_list').value
        //clear layers to avoid overlap
        department_employees_layer.clearLayers()
        single_employee_layer_group.clearLayers()
        
        //capture the date
        date = document.getElementById('date').value
        //capture the start and end times
        start_time = date+" "+document.getElementById('start_time').value
        end_time = date+" "+document.getElementById('end_time').value
        //create JS date objects for easy comparison
        loc_start_time = new Date(start_time)
        loc_end_time = new Date(end_time)

        //filter employees in the selected department
        dept_employees = all_employees.filter(function(emp){
           return emp.CurrentEmploymentType==department
        })

        //for each employee add a path for them
        for (let i in dept_employees){
            //get the CarID assigned to the employee
            var carId = dept_employees[i].CarID
            //filter the gps data matching the current datetime filter criteria
            var carLocations = location_by_minute.filter(function(location){
                gps_date_time = new Date(location.Timestamp)
                return location.id == carId && (gps_date_time>=loc_start_time && gps_date_time<=loc_end_time);
            });
             //extract the latitudes and longtitudes
            var latlngs = carLocations.map(function(loc){return [loc.lat,loc.long]}); 
            //create a path using the coordinates
            var path = L.polyline(latlngs, {"delay":400,"weight":3,"color":map_colors[carId],"paused":true,"reverse":true});
            //add popup to when the user clicks
            path.bindPopup("<span style='color:"+map_colors[carId]+"'>"+dept_employees[i].FirstName +" "+dept_employees[i].LastName+"</span>",{
                direction: 'auto',
                color:map_colors[carId],
                riseOnHover: true
            })
            //bolden the path when a user hoovers over it
            path.on("mouseover", function(e){
                this.setStyle({ "weight":5})
            })
            //unbolden the path when the mouse leaves 
            path.on("mouseout", function(e){
                this.setStyle({ "weight":3})
            })
            //add path to layer
            department_employees_layer.addLayer(path)
        }
        //add layer to map
        department_employees_layer.addTo(map)
}
function displayALlRoutes(start_time, end_time){
        all_employees_ids_layer_group.clearLayers()
        loc_start_time = new Date(start_time)
        loc_end_time = new Date(end_time)
        for (let i in all_employees){
            var carId = all_employees[i].CarID
            var carLocations = location_by_minute.filter(function(location){
                gps_date_time = new Date(location.Timestamp)
                return location.id == carId && (gps_date_time>=loc_start_time && gps_date_time<=loc_end_time);
            });
            var latlngs = carLocations.map(function(loc){return [loc.lat,loc.long]}); 
            var path = L.polyline(latlngs, {"delay":400,"weight":0.2,"color":"gray","paused":true,"reverse":true});
            //add popup to when the user clicks
            path.bindPopup("<span style='color:gray'>"+all_employees[i].FirstName +" "+all_employees[i].LastName+"</span>",{
                direction: 'auto',
                color:map_colors[carId],
                riseOnHover: true
            })
            //bolden the path when a user hoovers over it and color the path black
            path.on("mouseover", function(e){
                this.setStyle({ "weight":4, color:"black"})
            })
            //unbolden the path when the mouse leaves
            path.on("mouseout", function(e){
                this.setStyle({ "weight":1, color:"gray"})
            })
            // add path to layer
            all_employees_ids_layer_group.addLayer(path)
        }
        //add layer to map
    all_employees_ids_layer_group.addTo(map);
}
