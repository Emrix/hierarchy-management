//////////Set Up Vars\\\\\\\\\\
var itemDel;
var data;

var margin = { top: 20, right: 120, bottom: 20, left: 120 },
    width = 1200 - margin.right - margin.left, //***Adjust this one for the width of the window
    height = 280 - margin.top - margin.bottom; //***Adjust this one for the height of the window

var i = 0,
    duration = 750, //***Adjust this one for speed of transition
    root;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//////////End Set Up Vars\\\\\\\\\\





//////////Parsers\\\\\\\\\\
function getVerticleHeaders(csv) {
    if (!itemDel) {
        itemDel = ",";
    }
    var lines = csv.split("\n"); //Split the data into an array of lines
    var headers = lines[0].split(itemDel); //Get the header names
    var metaColumn = 0;
    for (var j = 0; j < headers.length; j++) { //Go through each of the columns, and assign parseable header names
        switch (headers[j]) {
            case "Node ID":
                headers[j] = "id";
                break;
            case "Node Name":
                headers[j] = "name";
                break;
            case "Parent ID":
                headers[j] = "parentId";
                break;
            case "Hierarchy Name":
                headers[j] = "hierarchy";
                break;
            case "Level Name":
                headers[j] = "level";
                break;
            default:
                headers[j] = headers[j].replace(/\s+/g, '');
                //headers[j] = ("meta" + metaColumn);
                metaColumn += 1;
                break;
        }
    }
    return headers;
}

function VerticleCSVToJSON(csv) {
    var lines = csv.split("\n");
    var result = [];
    var headers = getVerticleHeaders(csv);
    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        if (lines[i]) {
            var currentline = lines[i].split(",");
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }
            if (!obj.parentId) {
                obj.parentId = obj.hierarchy;
            }
            result.push(obj);
        }
    }
    return result; //JSON
}

function JSONToTree(list) {
    var map = {},
        node, roots = [],
        i; //Initialize Vars
    for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
    }
    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parentId !== "0") {
            var parentIDMapValue = map[node.parentId]; //Get the value of the parent ID of the node from the map
            if (!parentIDMapValue && parentIDMapValue != 0) { //This means that the parent doesn't exist in this list or map
                //Create the node
                var newNode = {
                    "hierarchy": node.hierarchy,
                    "id": node.parentId,
                    "level": "Top",
                    "name": node.parentId,
                    "parentId": "0"
                }
                //create it in the map
                map[node.parentId] = list.length;
                parentIDMapValue = list.length;
                //create it in the list
                list.push(newNode);
            }
            if (!list[parentIDMapValue].children) {
                list[parentIDMapValue].children = [];
            }
            list[parentIDMapValue].children.push(node); //Push the node into it's children
        } else {
            roots.push(node);
        }
    }
    return roots;
}

function parseVerticleCSV(data, delimiter) {
    if (!delimiter) {
        delimiter = ",";
    }

    var x = document.getElementById("hierarchySelect");
    while (x.firstChild) {
        x.removeChild(x.firstChild);
    }

    data = JSONToTree(VerticleCSVToJSON(data));

    for (i = 0; i < data.length; i += 1) {
        var optionName = data[i].id
        var z = document.createElement("option"); //Create the option
        z.setAttribute("value", optionName); //set the value
        var t = document.createTextNode(optionName);
        z.appendChild(t);
        document.getElementById("hierarchySelect").appendChild(z);
    }

    return data;
}
//////////End Parsers\\\\\\\\\\





//////////Tree Setup\\\\\\\\\\
function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

function setUpHierarchy() {
    var x = document.getElementById("hierarchySelect").value;
    var dataIndex = 0;
    for (i = 0; i < data.length; i += 1) {
        if (data[i].id === x) {
            dataIndex = i;
        }
    }

    root = data[dataIndex];
    root.x0 = height / 2;
    root.y0 = 0;
    root.children.forEach(collapse);
    update(root);

    d3.select(self.frameElement).style("height", "800px");
}


function update(source) { //Source refers to a single tree Hierarchy

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; }); //***Adjust this one for horizontal spacing

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", click);

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("text")
        //.attr("x", function(d) { return d.children || d._children ? -10 : 10; })
        .attr("x", function(d) { return -10; })
        .attr("dy", ".35em")
        //.attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .attr("text-anchor", function(d) { return "end"; })
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
        .attr("r", 4.5)
        .style("fill", function(d) {
            if (!d.children && !d._children) { //If it's a leaf node
                return "#737f23";
            } else {
                return d._children ? "lightsteelblue" : "#fff";
            }
        })
        .style("stroke", function(d) {
            if (!d.children && !d._children) { //If it's a leaf node
                return "#737f23";
            } else {
                return "#3883b2";
            }
        });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            var o = { x: source.x0, y: source.y0 };
            return diagonal({ source: o, target: o });
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
            var o = { x: source.x, y: source.y };
            return diagonal({ source: o, target: o });
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children on click.
function click(d) {
    if (d.parentId != 0) { //Makes it so you can't collapse the root node
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
    //Make it so the selected node is highlighted
}
//////////End Tree Setup\\\\\\\\\\





//////////File Import\\\\\\\\\\
document.forms['myform'].elements['myfile'].onchange = function(evt) {
    if (!window.FileReader) return; // Browser is not compatible

    var reader = new FileReader();

    reader.onload = function(evt) {
        if (evt.target.readyState != 2) return;
        if (evt.target.error) {
            alert('Error while reading file');
            return;
        }

        filecontent = evt.target.result;

        data = evt.target.result;
        data = parseVerticleCSV(data)
        setUpHierarchy(data);

    };

    reader.readAsText(evt.target.files[0]);

};
//////////End File Import\\\\\\\\\\