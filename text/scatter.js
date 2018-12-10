var margin = { top: 50, right: 300, bottom: 50, left: 70 },
    outerWidth = 1550,
    outerHeight = 800,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var formatDecimal = d3.format(",.1f");

var x = d3.time.scale()
	.domain ([new Date, new Date])
	.nice (d3.time.month)
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]).nice();

var xCat = "Date",
	dCat = "Date",
    yCat = "Number of Files Created",
    mCat = "File Size in MB",
    rCat = "File Size in B"
    fCat = "File Format",
    eCat = "Extension",
    colorCat = "File Type";

var parseDate = d3.time.format("%Y-%m-%d");

d3.csv("ELA_Dataset.csv", function(data) {
  data.forEach(function(d) {
    d.Date = parseDate.parse(d.Date);
    d.Length = +d.Length;
    d["Number of Files Created"] = +d["Number of Files Created"];
    d["File Size in MB"] = +d["File Size in MB"];
    d.Extension = d.Extension;
    d["File Format"] = d["File Format"];
  });

  var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
      xMin = d3.min(data, function(d) { return d[xCat]; }),
      xMin = xMin > 0 ? 0 : xMin,
      yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
      yMin = d3.min(data, function(d) { return d[yCat]; }),
      yMin = yMin > 0 ? 0 : yMin;

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

  var color = d3.scale.category10();

  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return dCat + ": " + d[dCat] + "<br>" + yCat + ": " + d[yCat] + 
        "<br>" + mCat + ": " + d[mCat] + "<br>" + fCat + ": " + d[fCat] +"<br>" + eCat + ": " + d[eCat] ;
      });

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);

  svg.call(tip);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .text(xCat);

  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", - margin.left + 10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yCat);

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

objects.selectAll(".dot")
   .data(data)
.enter().append("circle")
   .classed("dot", true)
    .attr("r", function (d) { return .001 * Math.sqrt(d[rCat] / Math.PI); })
    .attr("transform", transform)
     .style("fill", function(d) { return color(d[colorCat]); })
    .on('mouseover', function(d) {
    	tip.show(d)
       d3.select(this)
     	  .transition()
    	  .duration(250)
      	  .attr('stroke', 'blue')
    	  .attr('stroke-width',.5)
    	  tip.show

     })
 
     .on('mouseout', function (d) {
     	tip.hide(d)
       d3.select(this)
         .transition()
          .duration(250)
        .attr ('stroke', 'blue')
        .attr('stroke-width',0)
    	tip.hide});

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .classed("legend", true)
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
      .attr("fill", color);

  legend.append("circle")
      .attr("r", 5)
      .attr("cx", width + 20)
      .attr("fill", color);

  legend.append("text")
      .attr("x", width + 30)
      .attr("dy", ".35em")
      .text(function(d) { return d; });


  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
 return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }
});
