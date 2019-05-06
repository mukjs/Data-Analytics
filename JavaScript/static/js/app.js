// from data.js
var tableData = data;

//UFOTable 
var table_ufo = document. getElementById("ufo-table");


window.onload = function () {

  var unique_date=[... new Set(tableData.map(sighting=> sighting.datetime))];
  var select_date=document.getElementById("datetime");

  console.log(select_date);

  unique_date.forEach((date) => {
    var option=document.createElement("option");
    option.text=date;
    select_date.append(option);
  })
  
  var date = d3.select("#datetime");

  

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

submit.on("click", function() {

  // Prevent the page from refreshing
  d3.event.preventDefault();

  //Clear existing data from table
  for(var i = table_ufo.rows.length - 1; i > 0; i--){
    table_ufo. deleteRow(i);
  }
  

  var date = d3.select("#datetime");

  // Get the value property of the input element
  var inputValue = date.property("value");
  
  var filteredData = tableData.filter(sighting => sighting.datetime === inputValue);
  
  console.log(filteredData);

  var tbody = d3.select("tbody");

    // // Finally, display the filtered data in html
  filteredData.forEach((sighting) => {
    var row = tbody.append("tr");
    Object.entries(sighting).forEach(([key, value]) => {
      var cell = row.append("td");
      cell.text(value);
      });
  });

});
  