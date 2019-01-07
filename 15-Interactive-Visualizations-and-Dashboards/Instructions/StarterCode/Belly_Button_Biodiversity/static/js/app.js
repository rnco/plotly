function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var metadataURL = "/metadata/"+ sample;

  d3.json(metadataURL).then((response) => {
    console.log(response);
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    let metaDataPanel = d3.select("#sample-metadata");
    metaDataPanel.html("");
    Object.entries(response).forEach(function([key, value]) {
      var row = metaDataPanel.append("div");
      row.text(key + ": " + value);
    });
  });
};

    

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let sampleDataURL = "/samples/" + sample;
  console.log(sampleDataURL);
  d3.json(sampleDataURL).then((pieResponse) => {
    console.log(pieResponse);
    
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      type: "scatter",
      x: pieResponse.otu_ids,
      y: pieResponse.sample_values,
      text: pieResponse.otu_labels,
      mode: "markers",
      marker: {
        size: pieResponse.sample_values,
        color: pieResponse.otu_ids
      },
    };
    let bubbleData = [trace1]
    var layout = {  
    }
    console.log(bubbleData);
    Plotly.newPlot("bubble", bubbleData, layout);
    
    // @TODO: Build a Pie Chart
    let mappedSample = pieResponse.sample_values.map((value, key) =>{
      return value;
    });
    
    var sortedSample = mappedSample.sort((a, b) => (b-a)).slice(0,10);
    var topTenIndex = [];
    sortedSample.forEach((value)=>{
      topTenIndex.push(pieResponse.sample_values.indexOf(value));
    });
    function getValueFromIndex(arrIndex, arrValues){
      let values = [];
      arrIndex.forEach((value) => {
        values.push(arrValues[value]);
      });
      return values;
    };
    let otu_ids = getValueFromIndex(topTenIndex, pieResponse.otu_ids);
    let otu_labels = getValueFromIndex(topTenIndex, pieResponse.otu_labels);
    console.log(sortedSample);
    
    var trace2 = {
      type: "pie",
      labels: otu_ids,
      values: sortedSample,
      hoverinfo: otu_labels
    };

    var pieData = [trace2];

    var layout = {
    };

    Plotly.newPlot("pie", pieData, layout);
      
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
};

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
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
