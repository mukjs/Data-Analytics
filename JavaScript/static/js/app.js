// from data.js
var tableData = data;

//UFOTable 
var table_ufo = document. getElementById("ufo-table");

//List of columns in data
var columns=["datetime","city","state","country","shape"];

//Store list of unique column values from data for each of columns required for filtering
var unique = columns.map((column) => [... new Set(tableData.map(sighting => sighting[column]))]);
  
//Store a list of select items where dropdown filters will be added
var select=columns.map((column) => document.getElementById(column));

//Load dropdown filters and display full data on page load
window.onload = function () {

  //Add these unique items to each of the dropdown filters
  var i;
  for (i = 0; i < unique.length; i++) { 
    unique[i].forEach((item) => {
        var option=document.createElement("option");
        option.text=item;
        select[i].append(option);
      })
  }

 // Display entire table on page load
  var tbody = d3.select("tbody");
  tableData.forEach((sighting) => {
      var row = tbody.append("tr");
      Object.entries(sighting).forEach(([key, value]) => {
        var cell = row.append("td");
        cell.text(value);
        });
    });
}

// Select the submit button
var submit = d3.select("#filter-btn");

  //Filter and display data on submit
submit.on("click", function() {

  // Prevent the page from refreshing
  d3.event.preventDefault();

  //Clear existing data from table
  for(var i = table_ufo.rows.length - 1; i > 0; i--){
    table_ufo. deleteRow(i);
  }
  
  //Clear stored dropdown selected in previous submit
  var inputValue=[]

  // Get the value property of the current dropdown filters
  for (i = 0; i < select.length; i++) {
    inputValue.push(d3.select(`#${columns[i]}`).property("value"));
  }
    
  

  //filter data
  var j;
  var filteredData = tableData;
  
  for (j = 0; j < select.length; j++) {
      if (inputValue[j]!=="All") {
        filteredData = filteredData.filter(sighting => sighting[columns[j]] === inputValue[j]); 
      }
  }

  // // Finally, display the filtered data in html

  var tbody = d3.select("tbody");

  filteredData.forEach((sighting) => {
    var row = tbody.append("tr");
    Object.entries(sighting).forEach(([key, value]) => {
      var cell = row.append("td");
      cell.text(value);
      });
  });
  
});
  