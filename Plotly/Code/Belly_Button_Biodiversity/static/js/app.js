function build_Metadata_guageChart(sample) {

  // This function builds the metadata panel and the guage chart

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;

  // Use d3 to select the panel with id of `#sample-metadata`
  var metadata = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  metadata.html("");


  d3.json(url).then(function(sample_metadata) {

    console.log(sample_metadata);

    // Use `Object.entries` to add each key and value pair to the panel
  
    Object.entries(sample_metadata).forEach(([key, value]) => {
    metadata
      .append("p")
      .text(`${key} : ${value}`)
    });
      
  


    // Build the Gauge Chart
    
    var gauge=d3.select("#gauge");

    // Enter a speed between 0 and 180
    var level = sample_metadata.WFREQ;
    console.log(level);

    // Trig to calc meter point
    var degrees = 180 - (level*18+9);
    console.log(degrees);
    radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .01 0.025 L ',
    pathX = String(x),
    space = ' ',
    pathY = String(y),
    pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);


    var trace = [
    { type: 'scatter',
    x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'frequency',
    text: level,
    hoverinfo: 'text+name'},
    { values: [180/10, 180/10, 180/10, 180/10, 180/10, 180/10, 180/10,180/10, 180/10, 180/10,180],
    rotation: 90,
    text: ['9+', '8-9', '7-8', '6-7',
            '5-6', '4-5','3-4','2-3','1-2', '0-1'],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgba(20, 61, 29, .5)','rgba(4, 100, 0, .5)', 'rgba(45, 124, 10 , .5)','rgba(110, 154, 22, .5)',
                    'rgba(100, 190, 20, .5)', 'rgba(170, 202, 42, .5)','rgba(202, 209, 95, .5)',
                    'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                    'rgba(225, 237, 229, .5)','rgba(255, 255, 255, 0)']},
    labels: ['9+', '8-9', '7-8', '6-7',
    '5-6', '4-5','3-4','2-3','1-2', '0-1'],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
    }
    ];

    var layout = {
      shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
      title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
      height: 600,
      //width: 1000,
      xaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]}
    };
    
    console.log(gauge);
    Plotly.newPlot('gauge', trace,layout);



  });
}

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;



  // Build a Bubble Chart using the sample data
  d3.json(url).then(function(data) {

  console.log(data);

  var trace = {
    type: "scatter",
    mode: "markers",
    x: data.otu_ids,
    y: data.sample_values,
    text: data.otu_labels,
    marker: {
      color: data.otu_ids,
      size: data.sample_values,
      colorscale: 'YIGnBu',
    }
  };
  
  var scatter = [trace];
  
  var layout = {
    title: 'Belly Button Bio-diversity',
    showlegend: false,
        // height: 600,
        // width: 600
    xaxis: {
      title: {
        text: 'OTU ID',
      }
    },

        yaxis: {
          title: {
            text: 'Sample Values',
          }
        }
      };
  
      Plotly.newPlot("bubble", scatter, layout);
    





    // Build a Pie Chart
    
    
    var pie_val=data.sample_values.slice(0,10);
    var pie_lables=data.otu_ids.slice(0,10);
    var pie_hover=data.otu_labels.slice(0,10);

    console.log(pie_hover);

    var trace = [{
      values: pie_val,
      labels: pie_lables,
      text:pie_hover,
      type: 'pie',
      hoverinfo: 'text+label+value+percent',
      textinfo:'percent'
    }];
    
    var layout = {
   
    };
    
    Plotly.newPlot('pie', trace, layout);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    build_Metadata_guageChart(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  build_Metadata_guageChart(newSample);
}

// Initialize the dashboard
init();
