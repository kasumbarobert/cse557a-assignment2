const svgWidthLO = 800;
const svgHeightLO = 800;
const marginsLO = {top: 20, right: 50, bottom: 150, left: 50};

const loSVG = d3.select("#loyalty-time-graph-container").classed("content", true);
const loSVGBounds = loSVG.node().getBoundingClientRect();

const svg3 = loSVG
.append("svg")
.attr("height", svgHeightLO - marginsLO.top - marginsLO.bottom)
.attr("width", svgWidthLO - marginsLO.left - marginsLO.right)
.attr("viewBox", [0, 0, svgWidthLO, svgHeightLO])
.attr("id", "creditBarChart")

function loUpdate(lodata) {

    var businessOption = document.getElementById('lometric-select').value;
    console.log(businessOption)
    console.log(lodata)

    // determine yMax

    revArray = new Array()
    // freqArray = new Array()

    lodata.forEach(function (arrayItem) {
        var rev = arrayItem.revenue 
        revArray.push(rev);
    });

    console.log(revArray)

    yMaxLO = Math.max(...revArray);
    console.log(yMaxLO);

    console.log(lodata.length);

    const xScaleLO = d3.scaleBand()
        .domain(d3.range(lodata.length))
        .range([marginsLO.left, svgWidthLO - marginsLO.right])
        .padding(0.1);

    const yScaleLO = d3.scaleLinear()
        .domain([0, yMaxLO])
        .range([svgHeightLO - marginsLO.bottom, marginsLO.top]) 

    bottomTranslateLO = svgHeightLO - (marginsLO.bottom);

    // loSVG.selectAll("g").remove();
    svg3.selectAll("rect").remove()
    svg3.selectAll("g").remove()

    svg3.append("g")
    .attr("fill", "blue")
    .selectAll("rect")
    .data(lodata)
    .join("rect")
        .attr("id", (d) => d.date)
        .attr("class", "creditBar")
        .attr("y", function(d, index) {
            return yScaleLO(d.revenue);
        })
        .attr("x", function(d, index) {
            return xScaleLO(index); 
        }) 
        .attr("height", function(d) {
            return yScaleLO(0) - yScaleLO(d.revenue)
        })
        .attr("width", xScaleLO.bandwidth())
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
                return "translate(" + 0 + "," + bottomTranslateLO + ")";
            })
            .call(d3.axisBottom(xScaleLO).tickFormat(index => lodata[index].date))
            .attr("font-size", "14px")
            .attr("id", "x-axis")
            .selectAll("text")
            .attr("class", "x-axis-text")
            .attr("transform", "rotate(13)")
            
            // .attr("transform", function(d) {
            //     return "translate(0,10)"
            // })
        }
    
        function yAxis(g) {
            g.attr("transform", function(d) {
                return "translate(" + margins.left + "," + 0 + ")";
            })
            .call(d3.axisLeft(yScaleLO).ticks(null, lodata.format))
        }

    svg3.append("g").call(yAxis);
    svg3.append("g").call(xAxis);
    svg3.exit().remove();    

}



function loChangeData() {
    // // Load the file indicated by the select menu
    var selectOption = document.getElementById('lometric-select').value;
    console.log(selectOption)

    
    if (selectOption != "Select") {
    console.log("current datafile is " + selectOption)
    dataFileName = "agglo_" + selectOption + ".csv"
    console.log(dataFileName)

    d3.csv('business_loyalty_data/' + dataFileName).then(loUpdate);

    }

}

document.getElementById("lometric-select").addEventListener("change", loChangeData)
// document.getElementById("pmetric").addEventListener("change", changeData)
