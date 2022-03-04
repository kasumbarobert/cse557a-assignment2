//This Network graph based on the sample at https://bl.ocks.org/martinjc/e4c013dab1fabb2e02e2ee3bc6e1b49d

// the network visualizes employees who visited the same place 
// a link only exists between two employees if they went to the same place with in a span of 10 minutes for more than 200 times

var nodesLinked = {};
const svgNetWidthLO = 900;
const svgNetHeightLO = 800;
const marginsL1 = {top: 10, right: 10, bottom: 10, left: 10};
var nodes, node;
var links, link;
var widthL1 = svgNetWidthLO - marginsL1.left - marginsL1.right;
var heightL1 = svgNetHeightLO - marginsL1.top - marginsL1.bottom;

var linkWidthScale = d3.scaleLinear()
.range([1, 10]);
var linkStrengthScale = d3.scaleLinear()
.range([0, 0.45]);
var drag

//load the employee data
d3.json("data/network.json").then(function (network){
                var svg = d3.select("#friends-network").append("svg")
                .attr("height",svgNetHeightLO )
                .attr("width",svgNetWidthLO )
                .append("g")
                .attr("id","friends-network-svg-g")
                .attr('transform', 'translate(' + marginsL1.top + ',' + marginsL1.left + ')');
          
                //add an id to all nodes
                nodes = network.nodes
                nodes.forEach(function(part, index) {
                    this[index].id = this[index].name.replace(" ","_");
                    }, nodes)

                //modify the source and target to match the id instead of names
                links = network.links
                links.forEach(function(part, index) {
                
                    this[index].target = this[index].target.replace(" ","_");
                    this[index].source = this[index].source.replace(" ","_");

                    }, links)


                linkWidthScale.domain(d3.extent(links, function(d) {
                    return d.value*0.1;
                }));
                linkStrengthScale.domain(d3.extent(links, function(d) {
                    return d.value*0.1;
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
                        return d.color;
                    })
                    .on("mouseover", mouseOver(0.4))
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
                        return d.color;
                    });

                //define and start force simulation 
                var simulation = d3.forceSimulation()
                    .force("charge", d3.forceManyBody().strength(-10))
                    .force('center', d3.forceCenter(widthL1 / 2, heightL1 / 2))
                    .force('link', d3.forceLink()
                    .id(function(d) {
                                return d.id;
                            })
                    .strength(function(d) {
                        return linkStrengthScale(d.value );
                    })
                    );
                    simulation.nodes(nodes)
                    .on('tick', ticked)

                    simulation.force("link").links(links);

                links.forEach(function(d) {
                    nodesLinked[d.source.id + "_" + d.target.id] = 1;
                });

                //add drag event to the node. \
                drag = d3.drag().on('drag', handleDrag);
                node.call(drag)
            
            })

    function handleDrag(d){
        // this function updates the position of the nodes being dragged
        if (d.x < 0) {
            d.subject.x = 0
        } else if (d.x > widthL1) {
            d.subject.x = widthL1
        } else{
            d.subject.x = d.x
        };;
        
        if (d.y < 0) {
            d.subject.y = 0
        } else if (d.y > heightL1) {
            d.subject.y = heightL1
        }
        else{
            d.subject.y = d.y
        };;
        d3.select(this).call(drag)
    
    }
    
    //called as the force simulation is running
    function ticked(){
            link.attr("d", rePositionLink);
            node.attr("transform", rePositionNode);
    }

    //update the start and end position of the link as the node moves
    function rePositionLink(d) {
            var offset = 5;
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
    //update the node position as the simulation runs
    function rePositionNode(d) {
            pos_x =d.x
            pos_y = d.y
            if (pos_x < 0) {
                pos_x = 0
            }else if (pos_x > widthL1) {
                pos_x = widthL1
            }else{
                pos_x =d.x
            };;
            if (pos_y < 0) {
                pos_y = 0
            }else if (pos_y > heightL1) {
                pos_y = heightL1
            }
            else{
                pos_y =d.y
            };

            return "translate(" + pos_x + "," + pos_y + ")";
        }
    //checks if there is a link between any two nodes
    function hasLink(a, b) {
        return nodesLinked[a.id + "_" + b.id] || nodesLinked[b.id + "_" + a.id] || a.id == b.id;
    }

    //disable links and gray out nodes that are not connected to the node that is hoovered
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

            //gray out the links not connected to the hoovered node
            link.style("stroke-opacity", function(o) {
                return o.source === d || o.target === d ? 1 : opacity;
            });
            link.style("stroke", function(o) {
                return o.source === d || o.target === d ? o.source.color : "#ddd";
            });
        };
    }

    //reset the node and link colors ("ungray") after the mouse leaves a node
    function mouseOut() {
        node.style("stroke-opacity", 1);
        node.style("fill-opacity", 1);
        link.style("stroke-opacity", 1);
        link.style("stroke", "#ddd");
    }   