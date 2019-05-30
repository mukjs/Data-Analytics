var svgWidth = 1200;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
      d3.max(stateData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(stateData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
      d3.max(stateData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height,0]);

  return yLinearScale;

}

// function used for updating Axis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis,newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function renderLabels(chartLabels, newXScale, chosenXaxis,newYScale, chosenYaxis) {

  chartLabels.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]))
    .attr("dx", "-7")
    .attr("dy", "5");

  return chartLabels;
}

// Storing x & y axis labels
xAxisOptions={"poverty":"In Poverty (%)","age":"Median Age (yrs)","income":"$ Household income (Median)"};
yAxisOptions={"obesity":"Obesity (%)","smokes":"Smokes (%)","healthcareLow":"Lacks Healthcare (%)"};
var i;

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis,circlesGroup) {
  
  for (i = 0; i < 3; i++) {
    if (chosenXAxis === Object.keys(xAxisOptions)[i]) {
      var xlabel = Object.values(xAxisOptions)[i];
    }
    if (chosenYAxis === Object.keys(yAxisOptions)[i]) {
      var ylabel = Object.values(yAxisOptions)[i];
    }
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -100])
    .html(function(d) {
      return (`<strong>${d.state}</strong><br><br>${xlabel} : ${d[chosenXAxis]} <br>${ylabel} : ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data,this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv")
.then(function(stateData) {

  // parse data
  stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.income= +data.income;
    data.healthcareLow = +data.healthcareLow;
  });

  console.log(stateData);

  // xLinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(stateData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "coral")
    .attr("opacity", ".5");

    var chartLabels=chartGroup.append("g").selectAll("text")
    .data(stateData)
    .enter()
    .append("text")
    // Add your code below this line
    .attr("x",d=>xLinearScale(d[chosenXAxis]))
    .attr("y",d=>yLinearScale(d[chosenYAxis]))
    .attr("dx", "-7")
    .attr("dy", "5")
    .text(function(d){return d.abbr})
    .attr("font-size", "9px")
    .attr("fill", "black");


  // Create group for  2 x-axis & y-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  var ylabelsGroup = chartGroup.append("g");

  for (i = 0; i < 3; i++) {
     var nx=[20,40,60];
     var ny=["3.5em","2.5em","1.5em"]
     var class_name=["active","inactive","inactive"]

     this[Object.keys(xAxisOptions)[i]+'Label'] = xlabelsGroup.append("text")
     .attr("x", 0)
     .attr("y",nx[i])
     .attr("value",Object.keys(xAxisOptions)[i]) // value to grab for event listener
     .classed(class_name[i], true)
     .text(Object.values(xAxisOptions)[i]);  

    this[Object.keys(yAxisOptions)[i]+'Label'] = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left )
    .attr("x", 0 - (height / 2))
    .attr("dy", ny[i])
    .attr("value", Object.keys(yAxisOptions)[i]) // value to grab for event listener
    .classed(class_name[i], true)
    .text(Object.values(yAxisOptions)[i]);

    }


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var xvalue = d3.select(this).attr("value");
      if (xvalue !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = xvalue;

        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);

        // updates labels with new x values
        chartLabels = renderLabels(chartLabels, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

        // changes classes to change bold text
        for (i = 0; i < 3; i++) {
          if (chosenXAxis === Object.keys(xAxisOptions)[i]) {
            eval(Object.keys(xAxisOptions)[i]+'Label')
              .classed("active", true)
              .classed("inactive", false);
          }
          else {
            eval(Object.keys(xAxisOptions)[i]+'Label')
              .classed("active", false)
              .classed("inactive", true);
          }
        }
          
      }
    });

  // y axis labels event listener
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var yvalue = d3.select(this).attr("value");
      if (yvalue !== chosenYAxis) {
        
        // replaces chosenYAxis with value
        chosenYAxis = yvalue;
        
        // updates y scale for new data
        yLinearScale = yScale(stateData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x/y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);

        chartLabels = renderLabels(chartLabels, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

        // changes classes to change bold text

        for (i = 0; i < 3; i++) {
          if (chosenYAxis === Object.keys(yAxisOptions)[i]) {
            eval(Object.keys(yAxisOptions)[i]+'Label')
              .classed("active", true)
              .classed("inactive", false);
          }
          else {
            eval(Object.keys(yAxisOptions)[i]+'Label')
              .classed("active", false)
              .classed("inactive", true);
          }
        }
       
      }
    });
});

