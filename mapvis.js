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

d3.csv("data/locations_by_minute.csv").then(function (locationData){
    location_by_minute = locationData
})

map = L.map('map', {
center: [36.068421504029343 , 24.86214637756348],
zoom: 13
})
// .addLayer(L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
// maxZoom: 20,
// subdomains:['mt0','mt1','mt2','mt3']
// }));
all_employees_ids_layer_group = L.layerGroup()
single_employee_layer_group = L.layerGroup()
department_employees_layer = L.layerGroup()

d3.csv("assignment2/car-assignments.csv").then(function(employees) {

all_employees_ids = employees.map(function(emp){
    return emp.CarID
})
all_employees_ids = all_employees_ids.filter(Boolean)
all_employees = employees
var options = d3.select("#employees_list").selectAll("option")
.data(employees).enter().append("option");
options.text(function(d) {
    return d.FirstName+" "+d.LastName;
})
.attr("value", function(d) {
    return d.CarID;
});
d3.select("#departments_list").selectAll("option")
.data([...new Set(d3.map(employees, function(emp){return emp.CurrentEmploymentType;}))])
.enter()
.append("option")
.text(function(d){return d;})
.attr("value",function(d){return d;});

updateRoutes()
}).catch(function(err) {
        console.log(err)
})
var svg = d3.select(map.getPanes().overlayPane).append("svg"),
g = svg.append("g").attr("class", "leaflet-zoom-hide");
abila_layer_group = new L.KML("assignment2/Geospatial/Abila.kml");
map.addLayer(abila_layer_group);

var kmz = L.kmzLayer().addTo(map);
kmz.load("assignment2/Geospatial/Kronos Island.kmz")

d3.json("data/business_locations.json").then(function(locations){

for (let x in locations) {

    L.marker([locations[x].lat , locations[x].long])
        .bindTooltip(locations[x].name, 
        {
            //permanent: true, 
            direction: 'right',
            riseOnHover: true
        }
    ).addTo(map);
}
abila_layer_group.setStyle({color: '#eeeeee', "weight":0.2})

})

d3.select("#employees_list").on("change", function(){
updateRoutes()
});
d3.select("#departments_list").on("change", function(){
displayRoutesFromDept()

});
d3.select("#date").on("change", function(){
updateRoutes()

});

d3.select("#start_time").on("change", function(){
updateRoutes()

});
d3.select("#end_time").on("change", function(){
updateRoutes()

});

function updateRoutes(){
    console.log("Called")
    carId = document.getElementById('employees_list').value
    date = document.getElementById('date').value
    start_time = date+" "+document.getElementById('start_time').value
    end_time = date+" "+document.getElementById('end_time').value


    if (carId =="all"){
        displayALlRoutes(start_time, end_time)
        //single_employee_layer_group.clearLayers()
        //department_employees_layer.clearLayers()
    }
    else{
        displayALlRoutes(start_time, end_time)
        //department_employees_layer.clearLayers()
        //single_employee_layer_group.clearLayers()
        loc_start_time = new Date(start_time)
        loc_end_time = new Date(end_time)
        console.log(location_by_minute)
        var carLocations = location_by_minute.filter(function(location){
            gps_date_time = new Date(location.Timestamp)
            return location.id == carId && (gps_date_time>=loc_start_time && gps_date_time<=loc_end_time);
        });
        
        var latlngs = carLocations.map(function(loc){return [loc.lat,loc.long]}); 
        var path = L.polyline(latlngs, {"delay":400,"weight":3,"color":map_colors[carId],"paused":true,"reverse":true, "id":carId})
        i = carId
        path.bindPopup("<span style='color:"+map_colors[carId]+"'>"+all_employees[i].FirstName +" "+all_employees[i].LastName+"</span>",{
                direction: 'auto',
                color:map_colors[carId]
        })
        path.on("mouseover", function(e){
            this.setStyle({ "weight":5})
            map.openPopup(this._popup)
        })
        path.on("mouseout", function(e){
            this.setStyle({ "weight":3})
            map.closePopup()
        })
        path.on("clik", function(e){
            console.log(d3.select("#employees_list").node())
        })
       
        single_employee_layer_group.addLayer( L.circleMarker(latlngs[0],{color:"red",radius:7}))
        single_employee_layer_group.addLayer( L.circleMarker(latlngs[latlngs.length-1],{color:"blue",radius:7}))
        single_employee_layer_group.addLayer(path)
        single_employee_layer_group.addTo(map);
    }
    
    
}

function displayRoutesFromDept(){
        department = document.getElementById('departments_list').value
        //department_employees_layer.clearLayers()
        //single_employee_layer_group.clearLayers()
        date = document.getElementById('date').value
        start_time = date+" "+document.getElementById('start_time').value
        end_time = date+" "+document.getElementById('end_time').value
        loc_start_time = new Date(start_time)
        loc_end_time = new Date(end_time)
        dept_employees = all_employees.filter(function(emp){
           return emp.CurrentEmploymentType==department
        })
        for (let i in dept_employees){
            var carId = dept_employees[i].CarID
            var carLocations = location_by_minute.filter(function(location){
                gps_date_time = new Date(location.Timestamp)
                return location.id == carId && (gps_date_time>=loc_start_time && gps_date_time<=loc_end_time);
            });
            var latlngs = carLocations.map(function(loc){return [loc.lat,loc.long]}); 
            var path = L.polyline(latlngs, {"delay":400,"weight":3,"color":map_colors[carId],"paused":true,"reverse":true});
            path.bindPopup("<span style='color:"+map_colors[carId]+"'>"+dept_employees[i].FirstName +" "+dept_employees[i].LastName+"</span>",{
                direction: 'auto',
                color:map_colors[carId],
                riseOnHover: true
            })
            path.on("mouseover", function(e){
                this.setStyle({ "weight":5})
            })
            path.on("mouseout", function(e){
                this.setStyle({ "weight":3})
            })
            department_employees_layer.addLayer(path)
        }
        department_employees_layer.addTo(map)
}
function displayALlRoutes(start_time, end_time){
        //all_employees_ids_layer_group.clearLayers()
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
            path.bindPopup("<span style='color:gray'>"+all_employees[i].FirstName +" "+all_employees[i].LastName+"</span>",{
                direction: 'auto',
                color:map_colors[carId],
                riseOnHover: true
            })
            path.on("mouseover", function(e){
                this.setStyle({ "weight":4, color:"black"})
            })
            path.on("mouseout", function(e){
                this.setStyle({ "weight":1, color:"gray"})
            })
            all_employees_ids_layer_group.addLayer(path)
        }
    all_employees_ids_layer_group.addTo(map);
}
