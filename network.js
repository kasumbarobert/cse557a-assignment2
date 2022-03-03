
var nodesLinked = {};
const svgNetWidthLO = 820;
const svgNetHeightLO = 820;
const marginsL1 = {top: 20, right: 50, bottom: 150, left: 50};
var nodes, node;
var links, link;
var widthL1 = svgNetWidthLO - marginsL1.left - marginsL1.right;
var heightL1 = svgNetHeightLO - marginsL1.top - marginsL1.bottom;

var linkWidthScale = d3.scaleLinear()
.range([1, 10]);
var linkStrengthScale = d3.scaleLinear()
.range([0, 0.5]);

    d3.json("data/network.json").then(function (network){
                var svg = d3.select("#friends-network").append("svg")
                .attr("height",heightL1 )
                .attr("width",widthL1 )
                .append("g")
                .attr("id","friends-network-svg-g")
                .attr('transform', 'translate(' + marginsL1.top + ',' + marginsL1.left + ')');
          
                nodes = network.nodes
                nodes.forEach(function(part, index) {
                    this[index].id = this[index].name.replace(" ","_");
                    }, nodes)

                links = network.links
                links.forEach(function(part, index) {
                
                    this[index].target = this[index].target.replace(" ","_");
                    this[index].source = this[index].source.replace(" ","_");

                    }, links)


                linkWidthScale.domain(d3.extent(links, function(d) {
                    return d.value;
                }));
                linkStrengthScale.domain(d3.extent(links, function(d) {
                    return d.value;
                }));
                link = svg.selectAll(".link")
                    .data(links)
                    .enter()
                    .append("path")
                    .attr("class", "link")
                    .attr('stroke', function(d) {
                        return "#aaa";
                    })
                    .attr('stroke-width', function(d) {
                        return linkWidthScale(d.value);
                    });
                node = svg.selectAll(".node")
                    .data(nodes)
                    .enter()
                    .append("g")

                node.append("circle")
                    .attr("class", "node")
                    .attr("r", 8)
                    .attr("fill", function(d) {
                        return map_colors[parseInt(Math.random()*40)];
                    })
                    .on("mouseover", mouseOver(0.1))
                    .on("mouseout", mouseOut);

                node.append("title")
                    .text(function(d) {
                        return d.name;
                    });

                node.append("text")
                    .attr("dx", 12)
                    .attr("dy", ".35em")
                    .text(function(d) {
                        return d.name;
                    })
                    .style("stroke", "black")
                    .style("stroke-width", 0.5)
                    .style("fill", function(d) {
                        return map_colors[parseInt(Math.random()*40)];
                    });
                var simulation = d3.forceSimulation()
                    .force("charge", d3.forceManyBody().strength(-20))
                    .force('center', d3.forceCenter(widthL1 / 2, heightL1 / 2))
                    .force('link', d3.forceLink()
                    .id(function(d) {
                                return d.id;
                            })
                    .strength(function(d) {
                        return linkStrengthScale(d.value * 0.2);
                    })
                    );
                    simulation.nodes(nodes)
                    .on('tick', ticked)
                    simulation.force("link").links(links);

                links.forEach(function(d) {
                    nodesLinked[d.source.id + "_" + d.target.id] = 1;
                });
        
            
            })
           
    function ticked(){
            link.attr("d", rePositionLink);
            node.attr("transform", rePositionNode);
    }
    function rePositionLink(d) {
            var offset = 30;
            var midpoint_x = (d.source.x + d.target.x) / 2;
            var midpoint_y = (d.source.y + d.target.y) / 2;
        
            var dx = (d.target.x - d.source.x);
            var dy = (d.target.y - d.source.y);

            var normalise = Math.sqrt((dx * dx) + (dy * dy));

            var offSetX = midpoint_x + offset * (dy / normalise);
            var offSetY = midpoint_y - offset * (dx / normalise);

            return "M" + d.source.x + "," + d.source.y +
                "S" + offSetX + "," + offSetY +
                " " + d.target.x + "," + d.target.y;
}
    function rePositionNode(d) {
            if (d.x < 0) {
                d.x = 0
            };
            if (d.y < 0) {
                d.y = 0
            };
            if (d.x > widthL1) {
                d.x = widthL1
            };
            if (d.y > heightL1) {
                d.y = heightL1
            };
            return "translate(" + d.x + "," + d.y + ")";
        }
    function hasLink(a, b) {
        console.log( a.id + "_" + b.id, nodesLinked[b.id + "_" + a.id])
        return nodesLinked[a.id + "_" + b.id] || nodesLinked[b.id + "_" + a.id] || a.id == b.id;
    }
    function mouseOver(opacity) {
        return function(d) {
            node.style("stroke-opacity", function(o) {
                thisOpacity = hasLink(d.srcElement.__data__, o) ? 1 : opacity;

                return thisOpacity;
            });
            node.style("fill-opacity", function(o) {
                thisOpacity = hasLink(d.srcElement.__data__, o) ? 1 : opacity;
                return thisOpacity;
            });
            link.style("stroke-opacity", function(o) {
                return o.source === d || o.target === d ? 1 : opacity;
            });
            link.style("stroke", function(o) {
                return o.source === d || o.target === d ? o.source.color : "#ddd";
            });
        };
    }

    function mouseOut() {
        node.style("stroke-opacity", 1);
        node.style("fill-opacity", 1);
        link.style("stroke-opacity", 1);
        link.style("stroke", "#ddd");
    }   