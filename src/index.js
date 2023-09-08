import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
let dataset = [];

document.addEventListener("DOMContentLoaded", function () {
  // Define a function to fetch and process JSON data
  function fetchAndProcessData() {
    const apiUrl =
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

    // Fetch the JSON data
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((jsonData) => {
        // Access the "data" key in the JSON response and assign it to the dataset variable
        dataset = jsonData.data;

        // Now you can use 'dataset' as your D3.js dataset
        createBarChart(); // Call the function to create the bar chart
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  // Call the fetchAndProcessData function when the page loads
  window.onload = fetchAndProcessData;

  // Function to create the bar chart
  function createBarChart() {
    // Declare the chart dimensions and margins.
    const width = 1280; // Increased chart width
    const height = 500;
    const marginTop = 20;
    const marginRight = 80; // Increased right margin for x-axis labels
    const marginBottom = 80; // Increased bottom margin for x-axis labels
    const marginLeft = 80;

    // Declare the x (horizontal position) scale.
    const x = d3
      .scaleUtc()
      .domain([new Date("1947-01-01"), new Date("2015-07-01")]) // Adjusted x-axis domain
      .range([marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[1])])
      .range([height - marginBottom, marginTop]);

    // Select the container element where you want to append the chart.
    const container = d3.select(".container");

    // Create the SVG container.
    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Create a <rect> element for each data point (bar)
    svg
      .selectAll(".bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar") // Add the class "bar" to each <rect> element
      .attr("x", (d) => x(new Date(d[0])))
      .attr("y", (d) => y(d[1]))
      .attr("width", (width - marginLeft - marginRight) / dataset.length) // Adjust bar width based on dataset length
      .attr("height", (d) => height - marginBottom - y(d[1]))
      .attr("fill", "steelblue") // Set the fill color for the bars (you can customize this)
      .attr("data-date", (d) => d[0]) // Add data-date attribute with date value
      .attr("data-gdp", (d) => d[1]) // Add data-gdp attribute with GDP value
      .on("mouseover", handleMouseOver);

    // Add the x-axis.
    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(d3.timeYear.every(5)) // Display ticks every 5 years
          .tickFormat(d3.timeFormat("%Y"))
      )
      .selectAll(".tick")
      .classed("tick", true); // Add the class "tick" to the x-axis ticks

    // Add the y-axis.
    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(10))
      .selectAll(".tick")
      .classed("tick", true); // Add the class "tick" to the y-axis ticks

    // Tooltip element
    const tooltip = d3.select("body").append("div").attr("id", "tooltip");

    // Mouseover event handler
    function handleMouseOver(event, d) {
      // Apply class to change the fill color of the hovered bar
      d3.select(this).attr("fill", "orange");

      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`)
        .attr("data-date", d[0]) // Set data-date attribute for the tooltip
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    }
  }
});
