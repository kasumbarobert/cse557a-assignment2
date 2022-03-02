const svgWidth = 800;
const svgHeight = 800;
const margins = {top: 20, right: 50, bottom: 150, left: 50};

const barSVG = d3.select("#bgraph-container").classed("content", true);
const barSVGBounds = barSVG.node().getBoundingClientRect();

const svg = barSVG
.append("svg")
.attr("height", svgHeight - margins.top - margins.bottom)
.attr("width", svgWidth - margins.left - margins.right)
.attr("viewBox", [0, 0, svgWidth, svgHeight])
.attr("id", "businessBarChart")

function update(data) {

    var metricOption = document.getElementById("pmetric").value;
    console.log(metricOption)

    if (metricOption == "revenue") {
        var isRev = true;
    } else {
        var isRev = false;
    }

    revArray = new Array()
    freqArray = new Array()

    data.forEach(function (arrayItem) {
        var rev = arrayItem.revenue
        var freq = arrayItem.freq 
        revArray.push(rev);
        freqArray.push(freq);
    });

    if (isRev) {
        yMax = Math.max(...revArray);
    } else {
        yMax = Math.max(...freqArray);
    }
    
    console.log(yMax);

    const xScale = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margins.left, svgWidth - margins.right])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([svgHeight - margins.bottom, margins.top]) 

    bottomTranslate = svgHeight - (margins.bottom);

    // barSVG.selectAll("g").remove();
    svg.selectAll("rect").remove()
    svg.selectAll("g").remove()

    svg.append("g")
    .attr("fill", "red")
    .selectAll("rect")
    .data(data)
    .join("rect")
        .attr("id", (d) => d.location)
        .attr("class", "creditBar")
        .attr("y", function(d) {
            if (isRev) {
                console.log(isRev)
                return yScale(d.revenue);
            } else {
                return yScale(d.freq);
            }
        })
        .attr("x", (d, index) => xScale(index))
        .attr("height", function(d) {
            if (isRev) {
                return yScale(0) - yScale(d.revenue)
            } else {
                return yScale(0) - yScale(d.freq)
            }
        })
        .attr("width", xScale.bandwidth())
        .on("mouseover", function() {
            console.log("moused over")
            console.log(this)
            d3.select(this).attr({
                fill: "orange",
              });
        })
        .on("mouseout", function() {
            console.log("moused out")
            d3.select(this).attr({
                opacity: 1
            });
        })

        function xAxis(g) {
            g.attr("transform", function(d) {
                return "translate(" + 0 + "," + bottomTranslate + ")";
            })
            .call(d3.axisBottom(xScale).tickFormat(index => data[index].location))
            .attr("font-size", "10px")
            .attr("id", "x-axis")
            .selectAll("text")
            .attr("transform", "rotate(75)")
            .attr("class", "x-axis-text")
            // .attr("transform", function(d) {
            //     return "translate(0,10)"
            // })
        }
    
        function yAxis(g) {
            g.attr("transform", function(d) {
                return "translate(" + margins.left + "," + 0 + ")";
            })
            .call(d3.axisLeft(yScale).ticks(null, data.format))
        }

    svg.append("g").call(yAxis);
    svg.append("g").call(xAxis);
    svg.exit().remove();    

}

function changeData() {
    // // Load the file indicated by the select menu
    var selectOption = document.getElementById('date').value;
    var metricOption = document.getElementById("pmetric").value;
    console.log(metricOption)
    var isRev;

    if (selectOption != "Select") {
    console.log("current datafile is " + selectOption)
    dataFileName = "cc_" + selectOption + ".csv"
    console.log(dataFileName)
    
    if (metricOption == "revenue") {
        isRev = true;
        console.log(isRev)
        d3.csv('data/' + dataFileName).then(update);
    } else {
        isRev = false;
        d3.csv('data/' + dataFileName).then(update);
    }

    }

}

document.getElementById("date").addEventListener("change", changeData)
document.getElementById("pmetric").addEventListener("change", changeData)
changeData()
