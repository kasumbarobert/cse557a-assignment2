const svgWidthCC = 800;
const svgHeightCC = 800;
const marginsCC = {top: 20, right: 50, bottom: 150, left: 50};

const ccSVG = d3.select("#cc-time-graph-container").classed("content", true);
const ccSVGBounds = ccSVG.node().getBoundingClientRect();

const svg2 = ccSVG
.append("svg")
.attr("height", svgHeightCC - marginsCC.top - marginsCC.bottom)
.attr("width", svgWidthCC - marginsCC.left - marginsCC.right)
.attr("viewBox", [0, 0, svgWidthCC, svgHeightCC])
.attr("id", "creditBarChart")

function ccUpdate(ccdata) {

    var businessOption = document.getElementById('ccmetric-select').value;
    console.log(businessOption)
    console.log(ccdata)

    // determine yMax

    revArray = new Array()
    // freqArray = new Array()

    ccdata.forEach(function (arrayItem) {
        var rev = arrayItem.revenue 
        revArray.push(rev);
    });

    yMaxCC = Math.max(...revArray);
    console.log(yMaxCC);

    console.log(ccdata.length);

    const xScaleCC = d3.scaleBand()
        .domain(d3.range(ccdata.length))
        .range([marginsCC.left, svgWidthCC - marginsCC.right])
        .padding(0.1);

    const yScaleCC = d3.scaleLinear()
        .domain([0, yMaxCC])
        .range([svgHeightCC - marginsCC.bottom, marginsCC.top]) 

    bottomTranslateCC = svgHeightCC - (marginsCC.bottom);

    // ccSVG.selectAll("g").remove();
    svg2.selectAll("rect").remove()
    svg2.selectAll("g").remove()

    svg2.append("g")
    .attr("fill", "blue")
    .selectAll("rect")
    .data(ccdata)
    .join("rect")
        .attr("id", (d) => d.date)
        .attr("class", "creditBar")
        .attr("y", function(d, index) {
            return yScaleCC(d.revenue);
        })
        .attr("x", function(d, index) {
            return xScaleCC(index); 
        }) 
        .attr("height", function(d) {
            return yScaleCC(0) - yScaleCC(d.revenue)
        })
        .attr("width", xScaleCC.bandwidth())
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
                return "translate(" + 0 + "," + bottomTranslateCC + ")";
            })
            .call(d3.axisBottom(xScaleCC).tickFormat(index => ccdata[index].date))
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
            .call(d3.axisLeft(yScaleCC).ticks(null, ccdata.format))
        }

    svg2.append("g").call(yAxis);
    svg2.append("g").call(xAxis);
    svg2.exit().remove();    

}



function ccChangeData() {
    // // Load the file indicated by the select menu
    var selectOption = document.getElementById('ccmetric-select').value;
    console.log(selectOption)

    
    if (selectOption != "Select") {
    console.log("current datafile is " + selectOption)
    dataFileName = "aggcc_" + selectOption + ".csv"
    console.log(dataFileName)

    d3.csv('business_cc_data/' + dataFileName).then(ccUpdate);

    }

}

document.getElementById("ccmetric-select").addEventListener("change", ccChangeData)
// document.getElementById("pmetric").addEventListener("change", changeData)
