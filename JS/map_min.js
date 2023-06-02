const widthmap = window.innerWidth*0.55;
const heightmap = window.innerHeight*0.65;

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);


document.getElementById("title").innerHTML = "Percentage of land covered by forests"

const svg = d3.select('div#map').append("svg")
    .attr("width", widthmap)
    .attr("height", heightmap)
    .attr("class", "svg-content")
    .attr("viewbox", `0 0 ${widthmap} ${heightmap}`)

// load and display the World
const g = svg.append("g");
d3.json("data/info.json").then((topology) => {
  const features = topology.world.features
  projection = projection.fitSize([widthmap, heightmap], topology.world)
  path = d3.geoPath().projection(projection);

  g.selectAll("path")
    .data(features)
    .join((enter) => {
      enter.append("path")
        .attr("d", path)
        .attr("title", d => d.properties.name_long)
        .attr("stroke", "#4A4A4A")
        .attr("fill", d => {              // correspond forest à world lowres
            var to_find_forest = topology.forest.find(obj => obj.Area === d.properties.name_long)
            if (to_find_forest.Year != 1990){
              return 'rgb(169,169,169)';
            }
            // correspond size à world lowres
            var to_find_Size = topology.size.find(obj => obj.country === d.properties.name_long)
            // foret / taille en ha arrondi * 2500 (pour RBG)
            var forest_percent = to_find_forest.Value / to_find_Size.area
            var color = (forest_percent * 2500).toFixed();
            return `rgb(0, ${Math.round(color)}, 0)`;
          })
        .attr("stroke-width", 1)
        .attr("width", widthmap)
        .attr("height", heightmap)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke-width", 3);
            //Get this mouse x/y values,
            const coordinates = d3.pointer(event);
            //Update the tooltip position and text
            d3.select("#tooltip")
              .style("left", coordinates[0] + "px")
              .style("top", coordinates[1] + "px")
          //Show the tooltip
              .style("opacity", 0.9)  
              .select("#name")
              .text(d.properties.name_long)
            //Update the tooltip value
            d3.select("#value")
              .html(d.properties.name + "<br>" +
              "Population: " + d.properties.pop_est + "<br>" +
              "Region: " + d.properties.subregion + "<br>")
          })
        .on("click", function(event,d){
          var countryclicked = d.properties.name_long;
          document.getElementById("selectcountry").value = countryclicked;
          var activecountries = getactivecountries();
          activecountries.push(countryclicked);
          UpdateTheData(activecountries);
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke-width", 1);
            d3.select("#tooltip")
            .style("opacity", 0);
        })                            
    });

  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");
  output.innerHTML = slider.value;
  slider.oninput = function() {
    var year = this.value;
    output.innerHTML = year;
  

  //change the colors when the year is changed
  g.selectAll("path")
    .attr("fill", d => {
      if (year == "1990"){
        document.getElementById("title").innerHTML = "Percentage of Land covered by forests";
        document.getElementById("legendtitle").innerHTML = "<strong>Area covered by forest</strong>";
        document.getElementById("toptext").innerHTML ="≈10%";
        document.getElementById("middletext").innerHTML ="≈5%";
        document.getElementById("bottomtext").innerHTML ="0%";
        document.getElementById("top").style = "background-color: #00ff11"
        document.getElementById("middle").style = "background-color: #006b05"
        document.getElementById("bottom").style = "background-color: #000000"

        var to_find_forest = topology.forest.find(obj => obj.Area === d.properties.name_long)
          if (to_find_forest.Year != 1990){
            return 'rgb(169,169,169)';
          }
          // correspond size à world lowres
          var to_find_Size = topology.size.find(obj => obj.country === d.properties.name_long)
          // foret / taille en ha arrondi * 2500 (pour RBG)
          var forest_percent = to_find_forest.Value / to_find_Size.area
          var color = (forest_percent * 2500).toFixed();
          return `rgb(0, ${Math.round(color)}, 0)`;
      } else if (year =="2020") {
        document.getElementById("title").innerHTML = "Total Loss/Gain of forests from 1990-2020";
        document.getElementById("legendtitle").innerHTML = "<strong>Change in forest area</strong>";
        document.getElementById("toptext").innerHTML ="+15%";
        document.getElementById("middletext").innerHTML ="0%";
        document.getElementById("bottomtext").innerHTML ="-15%";
        document.getElementById("top").style = "background-color: rgb(25.5,255,0) "
        document.getElementById("middle").style = "background-color: rgb(255,255,0)"
        document.getElementById("bottom").style = "background-color: rgb(255,15,0)"

        //find the object of every country for the given year
        var to_find_forest = topology.forest.find(obj => obj.Area === d.properties.name_long && obj.Year == year);
        var first_Year = topology.forest.find(obj => obj.Area === d.properties.name_long);
        //if there is no value for the given year, make grey
        if (typeof to_find_forest == "undefined"){
          return 'rgb(169,169,169)';
        }

        if (typeof to_find_forest !== "undefined") {           
          var forest_change = (to_find_forest.Value-first_Year.Value)/first_Year.Value; 
          var color = 50+Math.round((forest_change * 300).toFixed());
          if(color<0){color=1} else if(color>100){color=99}
          var r,g;
          if (color<50){
            r = 255;
            g = 255*color/50;
          } else if (color>=50){
            r = 255*(50-color%50)/50;
            g = 255;
          }
          return `rgb(${r}, ${g},0`;
        }
      } else {
        document.getElementById("title").innerHTML = "Loss/Gain of forests during the year " + (year-1);
        document.getElementById("legendtitle").innerHTML = "<strong>Change in forest area</strong>";
        document.getElementById("toptext").innerHTML ="≈+1%";
        document.getElementById("middletext").innerHTML ="0%";
        document.getElementById("bottomtext").innerHTML ="≈-1%";
        document.getElementById("top").style = "background-color: rgb(5,255,0)"
        document.getElementById("middle").style = "background-color:  rgb(255,255,0)"
        document.getElementById("bottom").style = "background-color: rgb(255,5,0)"
        
        //find the object of every country for the given year
        var to_find_forest = topology.forest.find(obj => obj.Area === d.properties.name_long && obj.Year == year);
        var Year_before = topology.forest.find(obj => obj.Area === d.properties.name_long && obj.Year == (year-1));
        //if there is no value for the given year, make grey
        if (typeof to_find_forest == "undefined"){
          return 'rgb(169,169,169)';
        }

        if (typeof to_find_forest !== "undefined") {           
          var forest_change = (to_find_forest.Value-Year_before.Value)/Year_before.Value; 
          var color = 50+Math.round((forest_change * 8000).toFixed());
          if(color<0){color=1} else if(color>100){color=99}
          var r,g;
          if (color<50){
            r = 255;
            g = 255*color/50;
          } else if (color>=50){
            r = 255*(50-color%50)/50;
            g = 255;
          }
          if (to_find_forest.Area == "China"){
            console.log("r= "+r);
            console.log("g= "+g);
            console.log(forest_change*100)
          }
          return `rgb(${r}, ${g},0`;
        }
      }
    })
  }
});


//code for the graph:
import myJson from "/data/ForestDataAll.json" assert {type: 'json'};

//we are adding the countries to the options
var allcountries = [];
for (let i=0; i<myJson.data.length; i++){
    if (!(allcountries.includes(myJson.data[i].Area))){
        allcountries.push(myJson.data[i].Area);
    }
}

//making an array with all the data
var dataallcountries={};
for (let i=0;i<allcountries.length;i++){
  var option = document.createElement("option");
  option.text = allcountries[i];
  document.getElementById("selectcountry").add(option);


  var datacountry=[]
  for (let j=0; j<myJson.data.length; j++){
    if (myJson.data[j].Area == allcountries[i]){
      datacountry.push(myJson.data[j].Value);
    }
  }
  if (datacountry.length!= 31){
    var toomuch = 31- datacountry.length;
    for (let n=0;n<toomuch;n++){
      datacountry.unshift(0);
    }
  }
  dataallcountries[allcountries[i]]=datacountry;

  //get the value for the sum of all countries
  var datasum = {}
  for (let i=0; i<myJson.data.length; i++){
    //get values for first country
    if (myJson.data[i].Area == allcountries[0]){ 
        datasum[myJson.data[i].Year] = myJson.data[i].Value;
    } else {
        datasum[myJson.data[i].Year] += myJson.data[i].Value; 
    }
  }


  dataallcountries["all countries"]=(Object.values(datasum));
}


//Width and height
const   w = 450;
const h = 250;



//Create SVG element
var margin = {top: 20, right: 30, bottom:70 , left: 60},
    width = w + margin.left + margin.right,
    height = h - margin.top - margin.bottom;

const svg2 = d3.select("#graph")
            .append("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .attr("id","itsthegraph")
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");



function update_graph_multpl(dataset,countries){
  const dataReady = countries.map( function(grpName) { // .map allows to do something for each element of the list
    return {
      name: grpName,
      values: dataset.map(function(d) {
        return {year: d.year, value: +d[grpName]};
      })
    };
  });

  //get max for yScale
  var maxY = 0;
  var minY = 100000000;
  for (let i=0;i<countries.length;i++){
    for (let j=0;j<31;j++){
      maxY = Math.max(Math.max(dataReady[i]["values"][j]["value"]),maxY);
      minY = Math.min(Math.min(dataReady[i]["values"][j]["value"]),minY);
    }
  }  
  
  // A color scale: one color for each group
  const myColor = d3.scaleOrdinal()
    .domain(countries)
    .range(d3.schemeSet2);
  
  /*  I tried to remove the commas in the Years
  var parseTime = d3.timeParse("%Y");
  // format the data
  dataset.forEach(function(d) {
    d.year = parseTime(d.year);
  });*/

  // Add X axis
  const x = d3.scaleLinear() //to remove comma, make it to scaleTime: https://stackoverflow.com/questions/50413255/d3-tickformat-remove-comma-as-thousands-separator
    .range([ 0, w ])
    .domain(d3.extent(dataset, function(d) { return d.year}));
  svg2.append("g")
  .attr("transform", "translate(0," + h + ")")
  .call(d3.axisBottom(x));

  // Y axis
  const y = d3.scaleLinear()
    .domain([minY,maxY])
    .range([h, 0 ]);
  svg2.append("g")
    .call(d3.axisLeft(y));

  // Add the points
  svg2
  // First we need to enter in a group
    .selectAll("myDots")
    .data(dataReady)
    .join('g')
      .style("fill", d => myColor(d.name))
    // Second we need to enter in the 'values' part of this group
    .selectAll("myPoints")
    .data(d => d.values)
    .join("circle")
      .attr("cx", d => x(d.year))
      .attr("cy", d => y(d.value))
      .attr("r", function(d){if (d.value==0){return 0} else {return 3};})
      .attr("stroke", "white")



  // Add a legend at the end of each line
  svg2
    .selectAll("myLabels")
    .data(dataReady)
    .join('g')
      .append("text")
        .datum(d => { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
        .attr("transform",d => `translate(${x(d.value.year)-100},${y(d.value.value)-7})`) // Put the text at the position of the last point
        .attr("x", 12) // shift the text a bit more right
        .text(d => d.name)
        .style("fill", d => myColor(d.name))
        .style("font-size", 15)
        .style("padding",10)
        
  svg2.append("text")      // text label for the x axis
      .attr("x", w/2)
      .attr("y", h+35)
      .style("text-anchor", "middle")
      .text("Year")
      .style("fill", "black")
      .style("font-size", 14)
      .style("padding",10)
      .style("font-family","sans-serif")

}
  
//make graph appear when loading the page
document.addEventListener('DOMContentLoaded', function() {
    UpdateTheData(["all countries"]);
}, false);

//On click, update with new data			
d3.select("#selectcountry")
  .on("change", function(d) {
    var activecountries = getactivecountries();
    activecountries.push(this.value);
    UpdateTheData(activecountries);
  });

function UpdateTheData(countries){
  //clear svg from previous graph
  svg2.selectAll("*").remove();
  
  if (countries.length>0){
    //this is the last country chosen by selection
    var chosencountry = countries.findLast((element) => true)

    //add buttons to add/remove country
    const countrybutt = document.createElement("button");
    countrybutt.id = chosencountry + "butt";
    countrybutt.appendChild(document.createTextNode(chosencountry + " x"));
    if (checkifnew(countrybutt)){
      document.getElementById("countrybuttons").appendChild(countrybutt);
    }
    countrybutt.addEventListener("click",function(){
      removecountry(chosencountry);
    });
  }
  
    //in here are the data for each country: numbrcountries times an object
  var multpldatasets = []
  for (let i=0; i<31;i++){
    var b={};
    multpldatasets.push(b);
  }

  //fill objects with data
  for (let i=0; i<31;i++){
    multpldatasets[i]["year"]=i+1990;
    for (let j=0; j<countries.length; j++){
      multpldatasets[i][countries[j]]=dataallcountries[countries[j]][i];
    }
  }
  
  update_graph_multpl(multpldatasets,countries);
}


var countrybuttons = document.getElementById("countrybuttons");
//check if country clicked is already active
function checkifnew(countryclicked){
  //countryclicked.addEventListener("click", func)
  for(var i=0;i<countrybuttons.children.length;i++){
    if (countryclicked.id == countrybuttons.children[i].id){
      return false;
    }
  }
  return true;
}

//remove button of clicked country
function removecountry(country){
  var countryid = country + "butt";
  var countryindex
  for(var i=0;i<countrybuttons.children.length;i++){
    if (countryid == countrybuttons.children[i].id){
      countryindex = i;
    }
  }
  countrybuttons.removeChild(countrybuttons.children[countryindex]);
  
  var selection = document.getElementById("selectcountry");
  if (selection.value == country) {selection.value = "";}

  var activecountries = getactivecountries();
  UpdateTheData(activecountries); 
}

//find out which countries are active
function getactivecountries(){
  var actives = [];
  for(var i=0;i<countrybuttons.children.length;i++){
    var countryid = countrybuttons.children[i].id;
    countryid = countryid.substring(0, countryid.length - 4);
    actives.push(countryid);
  }
  return actives;
}

var myTimer;
d3.select("#scrollButton").on("click", function() {
 clearInterval (myTimer);
	myTimer = setInterval (function() {
    	var slider= d3.select("#myRange");
      var t = (+slider.property("value") + 1) % (+slider.property("max") + 1);
      if (t == 0) { t = +slider.property("min"); }
      slider.property("value", t);
      document.getElementById("myRange").dispatchEvent(new Event('input', { 'bubbles': true }))
    }, 500);
});

d3.select("#stopButton").on("click", function() {
	clearInterval (myTimer);
});
