import { separate, combine, splitPathString} from "flubber";
import { layoutTextLabel, layoutGreedy, layoutAnnealing, layoutLabel, layoutRemoveOverlaps } from 'd3fc-label-layout';
import { annotation, annotationCalloutRect, annotationCallout } from 'd3-svg-annotation';

function resize() {}

function init() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const screenRatio = windowWidth/windowHeight;

  Promise.all([
    d3.dsv(",", "assets/data/ranking_20190510.csv", function(d) {
      return {
        country: d.country,
        search: +d.search,
        tele: +d.tele,
        overall: +d.overall
      };
    }),
    d3.json('assets/data/eurovision_50m_simple.json'),
    d3.dsv(",", "assets/data/tele-search-by-year.csv", function(d) {
      return {
        to: d.to,
        searchpoints: +d.searchpoints,
        year: +d.year,
        votepoints: +d.votepoints
      };
    }),
    d3.dsv(",", "assets/data/votingdata_19.csv", function(d){
      return {
        to: d.to,
        from: d.from,
        search: +d.search,
        tele: +d.tele
      }
    }),
    d3.dsv(",", "assets/data/patterns.csv", function(d){
      return {
        from: d.from,
        to: d.to,
        search: +d.search,
        tele: +d.tele
      }
    })
  ])
  .then(([rankingdata, geodata, points, votingdata, patterns]) => {
    const grid = {
      //UPDATE STATUS TO ELIMINATED AFTER SEMIS
      ALB: {"status": "finalist", "coords": { x: 5, y: 8 }, "name": "Albania"},
      ARM: {"status": "finalist", "coords": { x: 9, y: 6 }, "name": "Armenia"},
      AUS: {"status": "finalist", "coords": { x: 9, y: 9 }, "name": "Australia"},
      AUT: {"status": "finalist", "coords": { x: 4, y: 5 }, "name": "Austria"},
      AZE: {"status": "finalist", "coords": { x: 9, y: 5 }, "name": "Azerbaijan"},
      BEL: {"status": "finalist", "coords": { x: 2, y: 3 }, "name": "Belgium"},
      BGR: {"status": "nonparticipant", "coords": { x: 7, y: 6 }, "name": "Bulgaria"},
      BIH: {"status": "nonparticipant", "coords": { x: 5, y: 6 }, "name": "Bosnia and Herzegovina"},
      BLR: {"status": "finalist", "coords": { x: 6, y: 3 }, "name": "Belarus"},
      CHE: {"status": "finalist", "coords": { x: 3, y: 4 }, "name": "Switzerland"},
      CYP: {"status": "finalist", "coords": { x: 8, y: 7 }, "name": "Cyprus"},
      CZE: {"status": "finalist", "coords": { x: 4, y: 4 }, "name": "Czechia"},
      DEU: {"status": "finalist", "coords": { x: 4, y: 3 }, "name": "Germany"},
      DNK: {"status": "finalist", "coords": { x: 4, y: 2 }, "name": "Denmark"},
      ESP: {"status": "finalist", "coords": { x: 1, y: 5 }, "name": "Spain"},
      EST: {"status": "finalist", "coords": { x: 6, y: 1 }, "name": "Estonia"},
      FIN: {"status": "finalist", "coords": { x: 6, y: 0 }, "name": "Finland"},
      FRA: {"status": "finalist", "coords": { x: 1, y: 4 }, "name": "France"},
      GBR: {"status": "finalist", "coords": { x: 1, y: 2 }, "name": "UK"},
      GEO: {"status": "finalist", "coords": { x: 8, y: 5 }, "name": "Georgia"},
      GRC: {"status": "finalist", "coords": { x: 6, y: 8 }, "name": "Greece"},
      HUN: {"status": "finalist", "coords": { x: 5, y: 5 }, "name": "Hungaria"},
      HRV: {"status": "finalist", "coords": { x: 4, y: 6 }, "name": "Croatia"},
      IRL: {"status": "finalist", "coords": { x: 0, y: 2 }, "name": "Ireland"},
      ISL: {"status": "finalist", "coords": { x: 0, y: 0 }, "name": "Iceland"},
      ISR: {"status": "finalist", "coords": { x: 8, y: 8 }, "name": "Israel"},
      ITA: {"status": "finalist", "coords": { x: 3, y: 5 }, "name": "Italia"},
      KOS: {"status": "nonparticipant", "coords": { x: 6, y: 7 }, "name": "Kosovo"},
      LTU: {"status": "finalist", "coords": { x: 6, y: 2 }, "name": "Lithuania"},
      LUX: {"status": "nonparticipant", "coords": { x: 2, y: 4 }, "name": "Luxembourg"},
      LVA: {"status": "finalist", "coords": { x: 7, y: 2 }, "name": "Latvia"},
      MDA: {"status": "finalist", "coords": { x: 7, y: 5 }, "name": "Moldova"},
      MKD: {"status": "finalist", "coords": { x: 7, y: 7 }, "name": "North Macedonia"},
      MLT: {"status": "finalist", "coords": { x: 1, y: 7 }, "name": "Malta"},
      MNE: {"status": "finalist", "coords": { x: 5, y: 7 }, "name": "Montenegro"},
      NLD: {"status": "finalist", "coords": { x: 3, y: 3 }, "name": "Netherlands"},
      NOR: {"status": "finalist", "coords": { x: 4, y: 0 }, "name": "Norway"},
      POL: {"status": "finalist", "coords": { x: 5, y: 3 }, "name": "Poland"},
      PRT: {"status": "finalist", "coords": { x: 0, y: 5 }, "name": "Portugal"},
      ROU: {"status": "finalist", "coords": { x: 6, y: 5 }, "name": "Romania"},
      RUS: {"status": "finalist", "coords": { x: 7, y: 3 }, "name": "Russia"},
      SMR: {"status": "finalist", "coords": { x: 2, y: 6 }, "name": "San Marino"},
      SRB: {"status": "finalist", "coords": { x: 6, y: 6 }, "name": "Serbia"},
      SVK: {"status": "nonparticipant", "coords": { x: 5, y: 4 }, "name": "Slovakia"},
      SVN: {"status": "finalist", "coords": { x: 3, y: 6 }, "name": "Slovenia"},
      SWE: {"status": "finalist", "coords": { x: 5, y: 0 }, "name": "Sweden"},
      UKR: {"status": "nonparticipant", "coords": { x: 6, y: 4 }, "name": "Ukraine"},
      TUR: {"status": "nonparticipant", "coords": { x: 8, y: 6 }, "name": "Turkey"}
    }
    const winners = {
      "2004": "UKR",    
      "2005": "GRC",
      "2006": "FIN",
      "2007": "SRB",
      "2008": "RUS",
      "2009": "NOR",
      "2010": "DEU",
      "2011": "AZE",
      "2012": "SWE",
      "2013": "DNK",
      "2014": "AUT",
      "2015": "SWE",
      "2016": "UKR",
      "2017": "PRT",
      "2018": "ISR"
    }

    /*TOOLTIP*/
    let tooltip = d3.select("body").append("div")	
      .attr("class", "tooltip")				
      .style("opacity", 0);
    
    /** SELECT LIST **/
    let froms = [...new Set(votingdata.map(el => el.from))];
    let tos  = [...new Set(votingdata.map(el => el.to))];
    
    function compare(arr1, arr2){
      let losers = [];
      arr1.forEach(
        (e1) => {
        if(!arr2.includes(e1)){
          losers.push(e1)
        }
      }
    )
    return losers;
    }
    const losers = compare(froms, tos);
    
    d3.select("#countrylist").selectAll("option")
      //.data(tofromCountries[filtervalues.fromto])
      .data(froms)
      .enter().append("option")
      .attr("value", (d) => d)
      .text((d) => grid[d].name);
    //UPDATE
    let filtervalues = {
      "country": "LVA",
      "fromto": "to",
      "searchtele": "search"
    }
    d3.select("option[value='LVA']").property("selected", true);
    
    /** RANKING **/
    const rankingHeight = 800;
    const rankingWidth = document.querySelector("#ranking-container").clientWidth;
    const rankingMargin = {top: 40, left: 120, right: 120};

    let rankingSvg = d3.select("#ranking")
      .attr("width", rankingWidth) 
      .attr("height", rankingHeight)

    let flagfilter = rankingSvg.append("filter")
      .attr("id","flagglow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    flagfilter.append("feGaussianBlur")
      .attr("stdDeviation","3")
      .attr("result","coloredBlur");
    let flagfeMerge = flagfilter.append("feMerge");
    flagfeMerge.append("feMergeNode")
      .attr("in","coloredBlur");
    flagfeMerge.append("feMergeNode")
      .attr("in","SourceGraphic");

    let countryScale = d3.scaleBand()
      .domain(Array.from(new Array(26),(val,index)=>index+1))
      .range([rankingMargin.top, rankingHeight])
    let voteScale = d3.scalePoint()
      .domain(["search", "tele", "overall"])
      .range([rankingMargin.left, rankingWidth - rankingMargin.right])
      .padding(0);

    const headers = {
      "search": "Search",
      "tele": "Televoting",
      "overall": "Overall"
    }

    rankingSvg.selectAll('text.header')
      .data(["search", "tele", "overall"])
      .enter().append("text")
      .attr('x', (d) => voteScale(d))
      .attr('y', 20)
      .text((d) => headers[d])
      .attr("class", (d) => `label-${d}`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-family', 'Rubik')
      //AFTER FINAL: DELETE
      .style("opacity", function(d){
        if(d == "search"){ return 1;}
        else{ return 0.3; }
      });

    const countryheight = 24;

    //Connecting lines
    //AFTER FINAL
    /*let line = d3.line()
      .x((d) => voteScale(d.key))
      .y((d) => d.value*countryScale.bandwidth() + countryheight/2)
      .curve(d3.curveMonotoneX);

    let linedata = [];
    rankingdata.forEach(function(el){
      let obj = {};
      obj.country = el.country;
      obj.values = [];
      obj.values.push({"key": "search", "value": el.search});
      obj.values.push({"key": "tele", "value": el.tele});
      obj.values.push({"key": "overall", "value": el.overall});
      linedata.push(obj)
    });

    rankingSvg.selectAll("line.connection")
      .data(linedata)
      .enter().append("path")
      .attr("d", (d) => line(d.values))
      .style("stroke-width", 1)
      .style("stroke", "white")
      .style("fill", "none")
      .style("filter", "url(#flagglow)");*/

  //Left part, search results
  rankingSvg.selectAll('image.flag')
      .data(rankingdata)
      .enter().append('image')
      .attr("xlink:href", function (d) { return 'assets/images/flags/' + d.country + '.svg' })
      .attr('x', voteScale("search") - countryheight/2)
      .attr("y", (d) => countryScale(d.search) - countryheight/2)
      .attr('class', function (d) { return 'id-' + d.Country; })
      .attr('width', countryheight - 2)
      .attr('height', countryheight - 2)
      .style("filter", "url(#flagglow)");
    rankingSvg.selectAll('image.question.tele')
      .data(rankingdata)
      .enter().append('image')
      //AFTER FINAL
      //.attr("xlink:href", function (d) { return 'assets/images/flags/' + d.country + '.svg' })
      .attr("xlink:href", function (d) { return 'assets/images/help-circle' + '.svg' })
      .style("opacity", 0.15)
      .attr('x', voteScale("tele") - countryheight/2)
      .attr('y', (d) => countryScale(d.tele) - countryheight/2)
      .attr('class', 'question')
      .attr('width', countryheight)
      .attr('height', countryheight);
    rankingSvg.selectAll('image.question.overall')
      .data(rankingdata)
      .enter().append('image')
      //AFTER FINAL
      //.attr("xlink:href", function (d) { return 'assets/images/flags/' + d.country + '.svg' })
      .attr("xlink:href", function (d) { return 'assets/images/help-circle' + '.svg' })
      .style("opacity", 0.15)
      .attr('x', voteScale("overall") - countryheight/2)
      .attr('y', (d) => countryScale(d.overall) - countryheight/2)
      .attr('class', 'question')
      .attr('width', countryheight)
      .attr('height', countryheight);
  rankingSvg.selectAll('text.countrylabel-left')
      .data(rankingdata)
      .enter().append('text')
      .attr('x', 0)
      .attr('y', (d) => countryScale(d.search))
      .attr("dy", "0.3em")
      .style('font-family', 'Rubik')
      .style('font-size', '14px')
      .attr('class', function (d) { return 'countrylabel id-' + d.country; })
      .attr('id', function (d) { return d.key; })
      .html(function (d, i) { return (i + 1) + '. ' + grid[d.country].name; });
    rankingSvg.selectAll('text.countrylabel-right')
      .data(rankingdata)
      .enter().append('text')
      .attr('x', rankingWidth)
      //AFTER FINAL
      //.attr("y", (d) => countryScale(d.overall))
      .attr("y", (d) => countryScale(d.search))
      .attr("dy", "0.3em")
      .style('font-family', 'Rubik')
      .style('font-size', '14px')
      .style('text-anchor', 'end')
      .attr('class', function (d) { return 'countrylabel id-' + d.country; })
      .attr('id', function (d) { return d.key; })
      //AFTER FINAL
      //.html((d) => d.overall + '. ' + grid[d.country].name);
      .html((d) => d.search + '. ?')
      .style("opacity", 0.3);

  /** MAP **/
  const mapWidth = document.querySelector("#map-container").clientWidth;
  let rectDim = 64;
  let mapHeight = 800;
  let gridMarginX = (mapWidth/2 - 5*rectDim)/rectDim;
  let gridMarginY = 120/rectDim;

  if(windowWidth < 640){
    rectDim = windowWidth/10;
    mapHeight = 640 + rectDim;
    gridMarginX = 0;
    gridMarginY = 0.5;
  }

  if(windowWidth < 450){
    mapHeight = 450 + rectDim;
  }

  const mapPadding = 20;
  let mapSvg = d3.select("#map")
    .attr("width", mapWidth)
    .attr("height", mapHeight);

  let extent = {
    'type': 'Feature',
    'geometry': {
    'type': 'Polygon',
    'coordinates': [[[-30, 70], [35, 70], [35, 30], [-30, 30]]]
    }
  }
  const projection = d3.geoAzimuthalEqualArea()
    .rotate([-10,-52,0]);
  projection.fitExtent([[mapPadding, mapPadding], [mapWidth - mapPadding, mapHeight - mapPadding]], extent);

  const geoPath = d3.geoPath()
    .projection(projection);

  function getCountryVotingData(filterparams) {
    let countryVotingData = votingdata.filter((el) => el[filterparams.fromto] == filterparams.country)
    let countryVoting = countryVotingData.map(el => {
      const obj = {};
      obj.to = el.to;
      obj.from = el.from;
      obj.points = el[filterparams.searchtele];
      return obj;
    })
    return countryVoting;
  }
  function getMapTooltipContent(countryID){
    let countryData = getCountryVotingData(filtervalues);
    let pointCategory = "Search activity";
    if(filtervalues.searchtele == "tele"){ pointCategory = "Televoting"}
    let direction = "from";
    if(filtervalues.fromto == "from"){ direction = "to"; }
    let tooltipData = countryData.filter((el) => el[direction] == countryID)[0];
    if(grid[countryID].status == "nonparticipant"){return `${grid[countryID].name} is not participating`}
    //AFTER FINAL
    //if(grid[countryID].status == "nonparticipant"){return `${grid[countryID].name} did not participate`}
    else if(filtervalues.fromto == "from" && grid[countryID].status == "eliminated"){return `${grid[countryID].name} was eliminated<br/> in the semi finals`}
    else{
      return `${pointCategory} points <br/> from ${grid[tooltipData.from].name} to ${grid[tooltipData.to].name}: ${tooltipData.points}`;
    }
  }

  let countries = mapSvg.selectAll('path')
    .data(geodata.features)
    .enter().append('path')
    .attr("id", (d) => d.properties.ADM0_A3)
    .attr("class", "country")
    .attr("d", geoPath)
    .style("fill", "#0D1730")
    .on("mouseover", function(d) {	
      tooltip.transition()		
          .duration(200)		
          .style("opacity", .9);		
      tooltip.html(getMapTooltipContent(d.properties.ADM0_A3))   
        //`${grid[d.properties.ADM0_A3].name} <br/>`)	
          .style("left", (d3.event.pageX + 28) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })
    .on("mousemove", function(){
      tooltip
        .style("left", (d3.event.pageX + 28) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");
    })					
    .on("mouseout", function(d) {		
      tooltip.transition()		
          .duration(500)		
          .style("opacity", 0);	
    })
    //.style("filter", "url(#glow)");

  /*COLOR MAP*/
  const cols = d3.scaleSequential(d3.interpolatePlasma)
    .domain([1,12]);

  //legend
  d3.selectAll('.legend-item')
    .style('background-color', function (d) {
        return cols(d3.select(this).text());
    });

  function colorMap(filterparams){
    let countrydata = getCountryVotingData(filterparams);
    let reversefromto = "from";
    if(filterparams.fromto == "from"){
      reversefromto = "to"
    }
    if(filterparams.fromto == "to"){
      losers.forEach((el) => {
        d3.select(`option[value=${el}]`).property("disabled", true);
      })
    }
    if(filterparams.fromto == "from"){
      d3.selectAll("option").property("disabled", false)
    }
    countries.transition().duration(1000).style("fill", (d) => {
      let countrypoints = countrydata.filter((el) => el[reversefromto] == d.properties.ADM0_A3);
      if(countrypoints.length == 1 && countrypoints[0].points > 0){
        let points = countrypoints[0].points;
        return cols(points);
      }
      else{
        return "#0D1730";
      }
    })
  };
  colorMap(filtervalues);

  /*MAP UPDATES*/
  function rectToPath(x, y, dim){
    x = x + gridMarginX;
    y = y + gridMarginY;
    return `M${x*rectDim},${y*rectDim} L${x*rectDim + dim},${y*rectDim} L${x*rectDim + dim},${y*rectDim + dim} L${x*rectDim},${y*rectDim + dim} L${x*rectDim},${y*rectDim}`
  }

  d3.selectAll("input.mapswitch").on("change", function(){
    let selvalue = d3.select(this).node().value;
    if(selvalue == "rects"){
      mapSvg.selectAll("path.country")
        .transition().duration(2000)
        .attrTween("d", function(){
          return combine(splitPathString(d3.select(this).attr("d")),
            rectToPath(grid[d3.select(this).attr("id")].coords.x, grid[d3.select(this).attr("id")].coords.y, rectDim),
            {"single": true}
          )
        });
        setTimeout(function () {
          let country;
          for (country in grid) {
              var bbox = mapSvg.select("path#" + country).node().getBBox();
              var translate = mapSvg.select("path#" + country).node().getCTM();
              var labelx = bbox.x + bbox.width / 2 + translate.e;
              var labely = bbox.y + bbox.height / 2 + translate.f;
              d3.select("#map").append("text")
                  .attr("x", labelx)
                  .attr("y", (labely + 4))
                  .attr("class", "map-label")
                  .text(country);
          }
      }, 2000);
    }
    if(selvalue == "geo"){
      mapSvg.selectAll("path.country")
        .transition().duration(2000)
        .attrTween("d", function(d){
          let cntr = d3.select(this).attr("id");
          return separate(d3.select(this).attr("d"),
          splitPathString(geoPath(geodata.features.filter((el) => el.properties.ADM0_A3 == cntr)[0])),
          {"single": true}
          )
        });
      d3.selectAll(".map-label").remove();
    }
  })

  d3.select("#countrylist").on("change", function(){
    filtervalues.country = d3.select(this).node().value;
    countries.classed("highlight", false);
    d3.select(".country#" + filtervalues.country).raise().classed("highlight", true).style("filter", "url(#glow)");
    colorMap(filtervalues);
  })

  //DELETE AFTER FINAL
  d3.select("#button6").property("disabled", true);

  d3.selectAll("input.fromtoswitch").on("change", function(){
    filtervalues.fromto = d3.select(this).node().value;
    colorMap(filtervalues);
  })

  d3.selectAll("input.searchteleswitch").on("change", function(){
    filtervalues.searchtele = d3.select(this).node().value;
    colorMap(filtervalues);
  })

  /*SCATTER TOTAL*/
  //Calculate average points awarded to each country over the 15 years
  let pointsMean = d3.nest()
    .key((d) => d.to)
    .rollup((d) => {return {
      searchpoints: d3.mean(d, (g) => g.searchpoints),
      votepoints: d3.mean(d, (g) => g.votepoints)
    }})
    .entries(points);
  
  const maxSearchPoints = d3.max(pointsMean, (d) => d.value.searchpoints);
  const maxVotePoints = d3.max(pointsMean, (d) => d.value.votepoints);
  const maxPoints = d3.max([maxSearchPoints, maxVotePoints]);

  const scatterMargins = {top: 70, right: 40, bottom: 60, left: 60};
  const scatterWidth = document.querySelector("#scatter-container").clientWidth;
  //let scatterRatio = 2/3;
  //const scatterHeight = scatterWidth * scatterRatio;
  const scatterHeight = scatterWidth/screenRatio;

  const scatterInnerWidth = scatterWidth - scatterMargins.left - scatterMargins.right;
  const scatterInnerHeight = scatterHeight - scatterMargins.top - scatterMargins.bottom;

  let scatterOverallSvg = d3.select("svg#scatter")
    .attr("width", scatterWidth)
    .attr("height", scatterHeight)
    .append("g")
      .attr("transform", `translate(${scatterMargins.left},${scatterMargins.top})`);
  
  let defs = scatterOverallSvg.append("defs");

  let filter = defs.append("filter")
    .attr("id","glow")
    .attr("x", "-50%")
    .attr("y", "-50%")
    .attr("width", "200%")
    .attr("height", "200%");
  filter.append("feGaussianBlur")
    .attr("stdDeviation","4")
    .attr("result","coloredBlur");
  let feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode")
    .attr("in","coloredBlur");
  feMerge.append("feMergeNode")
    .attr("in","SourceGraphic");
  
  let scatterScaleX = d3.scaleLinear()
    //.domain([0,maxPoints])
    .domain([0,210])
    .range([0,scatterInnerWidth]);
  
  let scatterScaleY = d3.scaleLinear()
    //.domain([0,maxPoints])
    .domain([0,190])
    .range([scatterInnerHeight, 0]);

  const tickPadding = 10;
  let xAxis = d3.axisBottom(scatterScaleX)
    .tickValues([50,100,150])
    .tickPadding(tickPadding)
    .tickSize(-scatterInnerHeight);
  let yAxis = d3.axisLeft(scatterScaleY)
    .tickValues([50,100,150])
    .ticks(5)
    .tickPadding(tickPadding)
    .tickSize(-scatterInnerWidth);

  scatterOverallSvg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${scatterInnerHeight})`)
    .call(xAxis);
  scatterOverallSvg.append("text")
    .text("Search activity points")
    .attr("x", scatterInnerWidth)
    .attr("y", scatterInnerHeight + 36)
    .attr("class", "x axis-title")
  scatterOverallSvg.append("text")
    .text("Televoting points")
    .attr("x", 0)
    .attr("y", -40)
    .attr("class", "y axis-title")

  scatterOverallSvg.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(0,0)`)
    .call(yAxis);

  scatterOverallSvg.append("line")
    .attr("x1", scatterScaleX(0))
    .attr("x2", scatterScaleX(200))
    .attr("y1", scatterScaleY(0))
    .attr("y2", scatterScaleY(200))
    .attr("class", "fourtyfive");

  scatterOverallSvg.append("text")
    .text("Line of equal search and televoting points")
    .attr("class", "annotation")
    .style("fill", "#ffffff")
    .style("font-size", "10px")
    .attr("transform", `translate(${scatterScaleX(160)},${scatterScaleY(160)}) rotate(${-Math.atan(scatterScaleY(0)/scatterScaleX(190))
    *180/Math.PI})`)
    .attr("dy", -3)

  let moreSearchOverall = scatterOverallSvg.append("text")
    .attr("y", scatterScaleY(30))
    .style("fill", "#ffffff")
    .style("text-anchor", "middle")
    .attr("class", "annotation");
  moreSearchOverall.append("tspan").attr("x", scatterScaleX(150)).text("More search")
  moreSearchOverall.append("tspan").attr("x", scatterScaleX(150)).text("activity than televoting").attr("dy", "1em");

  let moreTelevotingOverall = scatterOverallSvg.append("text")
    .attr("y", scatterScaleY(180))
    .style("fill", "#ffffff")
    .style("text-anchor", "middle")
    .attr("class", "annotation");
  moreTelevotingOverall.append("tspan").attr("x", scatterScaleX(25)).text("More televoting")
  moreTelevotingOverall.append("tspan").attr("x", scatterScaleX(25)).text("than search activity").attr("dy", "1em");

  scatterOverallSvg.selectAll("img")
    .data(pointsMean)
    .enter().append("image")
    .attr("xlink:href", function (d) { return "assets/images/flags/" + d.key + ".svg" })
    .attr('width', countryheight)
    .attr('height', countryheight)
    .attr("x", (d) => scatterScaleX(d.value.searchpoints) - countryheight/2)
    .attr("y", (d) => scatterScaleY(d.value.votepoints) - countryheight/2)
    .style("filter", "url(#glow)")
    .on("mouseover", function(d) {	
      tooltip.transition()		
          .duration(200)		
          .style("opacity", .9);		
      tooltip.html(`<strong>${grid[d.key].name}</strong> <br/>
                    Search: ${Math.round(d.value.searchpoints)} points<br/>
                    Televoting: ${Math.round(d.value.votepoints)} points`)	
          .style("left", (d3.event.pageX + 28) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })
    .on("mousemove", function(){
      tooltip
        .style("left", (d3.event.pageX + 28) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");
    })					
    .on("mouseout", function(d) {		
      tooltip.transition()		
          .duration(500)		
          .style("opacity", 0);	
    });

    const labelPadding = 2;

    //Component used to render labels
    const textLabel = layoutTextLabel()
      .padding(labelPadding)
      .value(d => grid[d.key].name);

    const strategy = layoutRemoveOverlaps();
    
    //Create the layout that positions the labels
    const labels = layoutLabel(strategy)
        .size((d, i, g) => {
            const textSize = g[i].getElementsByTagName('text')[0].getBBox();
            return [textSize.width + labelPadding * 2, textSize.height + labelPadding * 2];
        })
        .xScale(scatterScaleX)
        .yScale(scatterScaleY)
        .position(d => {return [d.value.searchpoints, d.value.votepoints]})
        .component(textLabel);

    //Render labels
    scatterOverallSvg.datum(pointsMean)
         .call(labels);
    //Reposition labels to top
    scatterOverallSvg.selectAll("g.label text")
      .attr("dx", function(d) {
        return -d3.select(this.parentNode).attr("layout-width")/2;
      })
      .attr("dy", function(d) {
        return -d3.select(this.parentNode).attr("layout-height")/2 - 8;
      });

  /*YEARLY SCATTER*/
  const maxSearchYearlyPoints = d3.max(points, (d) => d.searchpoints);
  const maxVoteYearlyPoints = d3.max(points, (d) => d.votepoints);
  const maxYearlyPoints = d3.max([maxSearchYearlyPoints, maxVoteYearlyPoints]);

  let scatterYearlySvg = d3.select("svg#scatteryearly")
    .attr("width", scatterWidth)
    .attr("height", scatterHeight)
    .append("g")
    .attr("transform", `translate(${scatterMargins.left},${scatterMargins.top})`);
      
  let scatterYearlyScaleX = d3.scaleLinear()
    .domain([0,maxYearlyPoints])
    .range([0,scatterInnerWidth]);
      
  let scatterYearlyScaleY = d3.scaleLinear()
    .domain([0,maxYearlyPoints])
    .range([scatterInnerHeight, 0]);
 
  let xYearlyAxis = d3.axisBottom(scatterYearlyScaleX)
    .tickValues([100,200,300])
    .tickPadding(tickPadding)
    .tickSize(-scatterInnerHeight);
  let yYearlyAxis = d3.axisLeft(scatterYearlyScaleY)
    .tickValues([100,200,300])
    .ticks(5)
    .tickPadding(tickPadding)
    .tickSize(-scatterInnerWidth);

  scatterYearlySvg.append("line")
    .attr("x1", scatterYearlyScaleX(0))
    .attr("x2", scatterYearlyScaleX(maxYearlyPoints))
    .attr("y1", scatterYearlyScaleY(0))
    .attr("y2", scatterYearlyScaleY(maxYearlyPoints))
    .attr("class", "fourtyfive");
    
  scatterYearlySvg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${scatterInnerHeight})`)
    .call(xYearlyAxis);
  scatterYearlySvg.append("text")
    .text("Search activity points")
    .attr("x", scatterInnerWidth)
    .attr("y", scatterInnerHeight + 36)
    .attr("class", "x axis-title")
  scatterYearlySvg.append("text")
    .text("Televoting points")
    .attr("x", 0)
    .attr("y", -20)
    .attr("class", "y axis-title")
    
  scatterYearlySvg.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(0,0)`)
    .call(yYearlyAxis);

  let dimSmall = 12;
  let yearlyFlags = scatterYearlySvg.selectAll("img")
    .data(points)
    .enter().append("image")
    .attr("xlink:href", function (d) { return "assets/images/flags/" + d.to + ".svg" })
    .attr('width', dimSmall)
    .attr('height', dimSmall)
    .attr("x", (d) => scatterYearlyScaleX(d.searchpoints) - dimSmall/2)
    .attr("y", (d) => scatterYearlyScaleY(d.votepoints) - dimSmall/2)
    .attr("class", (d) => `flag-year flag-${d.year} flag-${d.to}`)
    .style("filter", "url(#glow)")
    .style("opacity", 0.3)
    .on("mouseover", function(d) {	
      tooltip.transition()		
          .duration(200)		
          .style("opacity", .9);		
      tooltip.html(`<strong>${grid[d.to].name} in ${d.year}</strong> <br/>
                    Search: ${Math.round(d.searchpoints)} points<br/>
                    Televoting: ${Math.round(d.votepoints)} points`)	
          .style("left", (d3.event.pageX + 28) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })
    .on("mousemove", function(){
      tooltip
        .style("left", (d3.event.pageX + 28) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");
    })					
    .on("mouseout", function(d) {		
      tooltip.transition()		
          .duration(500)		
          .style("opacity", 0);	
    });

  let yearTitle = scatterYearlySvg.append("text")
      .attr("x", scatterInnerWidth/2)
      .attr("y", -16)
      .text("2018")
      .attr("class", "yearly-title");
  
  scatterYearlySvg.append("text")
      .attr("x", 40)
      .attr("y", 30)
      .attr("class", "winner-legend")
      .text("Winner")
      .attr("dy", "0.3em");
  scatterYearlySvg.append("circle")
      .attr("cx", 40)
      .attr("cy", 30)
      .attr("r", 24)
      .attr("class", "circle-winner-legend");
  
  const textLabelYearly = layoutTextLabel()
    .padding(labelPadding)
    .value(d => grid[d.to].name);
  
  const labelsYearly = layoutLabel(strategy)
      .size((d, i, g) => {
          const textSize = g[i].getElementsByTagName('text')[0].getBBox();
          return [textSize.width + labelPadding * 2, textSize.height + labelPadding * 2];
      })
      .xScale(scatterYearlyScaleX)
      .yScale(scatterYearlyScaleY)
      .position(d => {return [d.searchpoints, d.votepoints]})
      .component(textLabelYearly);

  function highlightYear(yr){
    scatterYearlySvg.selectAll("g.label text").transition().duration(1000).style("opacity", 0);
    yearlyFlags.style("filter", "none").transition().duration(1000)
      .attr("width", dimSmall)
      .attr("height", dimSmall)
      .attr("x", (d) => scatterYearlyScaleX(d.searchpoints) - dimSmall/2)
      .attr("y", (d) => scatterYearlyScaleY(d.votepoints) - dimSmall/2)
      .style("opacity", 0.1);
    let winner = winners[yr];
    let winnerData = points.filter((el) => el.year == yr && el.to == winner);
    
    if(scatterYearlySvg.selectAll("circle.winner").empty()){
      scatterYearlySvg.selectAll("circle.winner")
        .data(winnerData)
        .enter().append("circle")
        .attr("cx", (d) => scatterYearlyScaleX(d.searchpoints))
        .attr("cy", (d) => scatterYearlyScaleY(d.votepoints))
        .attr("r", 30)
        .attr("class", "winner");
    }
    else{
      scatterYearlySvg.selectAll("circle.winner")
        .data(winnerData)
        .transition().duration(1000)
        .attr("cx", (d) => scatterYearlyScaleX(d.searchpoints))
        .attr("cy", (d) => scatterYearlyScaleY(d.votepoints))
        .style("opacity", 1);   
    }

    scatterYearlySvg.selectAll(".flag-" + yr).transition().duration(1000)
      .attr("width", countryheight)
      .attr("height", countryheight)
      .attr("x", (d) => scatterYearlyScaleX(d.searchpoints) - countryheight/2)
      .attr("y", (d) => scatterYearlyScaleY(d.votepoints) - countryheight/2)
      .style("opacity", 1)
      .style("filter", "url(#glow)")
      .on("end", function() {
        scatterYearlySvg.datum(points.filter((el) => el.year == yr))
          .call(labelsYearly)
        
        scatterYearlySvg.selectAll("g.label text")
          .attr("dx", function(d) {
            return -d3.select(this.parentNode).attr("layout-width")/2;
          })
          .attr("dy", function(d) {
            return -d3.select(this.parentNode).attr("layout-height")/2 - 8;
          });
          scatterYearlySvg.selectAll("g.label text").transition().duration(500).style("opacity", 1);
        }
      );
    yearTitle.text(yr);
  }

  highlightYear(2018);

  d3.select("input#slider").on("change", function(){
    highlightYear(this.value);
  })

  /*SCATTER PATTERNS*/
  const patternscatterMargins = {top: 200, right: 80, bottom: 60, left: 60};
  const patternscatterWidth = document.querySelector("#votingpattern-container").clientWidth;
  const patternscatterRatio = 3;
  const patternscatterHeight = patternscatterWidth * patternscatterRatio;

  const patternscatterInnerWidth = patternscatterWidth - patternscatterMargins.left - patternscatterMargins.right;
  const patternscatterInnerHeight = patternscatterHeight - patternscatterMargins.top - patternscatterMargins.bottom;

  const maxSearchPatternPoints = d3.max(patterns, (d) => d.search);
  const maxVotePatternPoints = d3.max(patterns, (d) => d.tele);
  const maxPatternPoints = d3.max([maxSearchPatternPoints, maxVotePatternPoints]);

  let stickyContainerLeft = d3.select("#votingpattern-container")
    .insert("div", "svg")
    .style("position", "absolute")
    .style("width", patternscatterWidth + "px")
    .style("height", patternscatterHeight - 170 + "px")
    .style("top", "180px")
    .style("pointer-events", "none");
  let stickyContainerRight = d3.select("#votingpattern-container")
    .insert("div", "svg")
    .style("position", "absolute")
    .style("width", patternscatterWidth + "px")
    .style("height", patternscatterHeight - 50 + "px")
    .style("top", "0px")
    .style("pointer-events", "none");
  stickyContainerLeft.append("div")
    .attr("class", "y axis-title sticky")
    .append("p")
    .html("<img inline src='assets/images/arrow-up.svg' width='24px' height='24px'>MORE<br/>TELEVOTING<br/>POINTS")
    .style("text-align", "center")
    .style("font-size", "0.7em");
  stickyContainerRight.append("div")
    .attr("class", "x axis-title sticky")
    .append("p")
    .html("<img inline src='assets/images/arrow-right.svg' width='24px' height='24px'>MORE<br/>SEARCH ACTIVITY<br/>POINTS")
    .style("text-align", "center")
    .style("font-size", "0.7em");

  let scatterPatternSvg = d3.select("svg#votingpattern")
    .attr("width", patternscatterWidth)
    .attr("height", patternscatterHeight)
    .append("g")
    .attr("transform", `translate(${patternscatterMargins.left},${patternscatterMargins.top})`);
      
  let scatterPatternScaleX = d3.scaleLinear()
    .domain([30,maxPatternPoints])
    .range([0,patternscatterInnerWidth]);
      
  let scatterPatternScaleY = d3.scaleLinear()
    .domain([30,maxPatternPoints])
    .range([patternscatterInnerHeight, 0]);
 
  let xPatternAxis = d3.axisTop(scatterPatternScaleX)
    .tickValues([50,100])
    .tickSize(-patternscatterInnerHeight);
  let yPatternAxis = d3.axisLeft(scatterPatternScaleY)
    .tickValues([50,75,100,125])
    .ticks(5)
    .tickPadding(10)
    .tickSize(-patternscatterInnerWidth);
    
  scatterPatternSvg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,10)`)
    .call(xPatternAxis);
    
  scatterPatternSvg.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(0,0)`)
    .call(yPatternAxis);
    
  scatterPatternSvg.append("line")
    .attr("x1", scatterPatternScaleX(0))
    .attr("x2", scatterPatternScaleX(200))
    .attr("y1", scatterPatternScaleY(0))
    .attr("y2", scatterPatternScaleY(200))
    .attr("class", "fourtyfive");

  const type = annotationCallout;

  const annotations = [
    {
      note: {
        label: "LINE OF EQUAL SEARCH AND TELEVOTING POINTS",
        padding: 0
      },
      data: { search: maxPatternPoints + 3, tele: maxPatternPoints + 3},
      dy: -1,
      dx: -70,
      connector: { end: "arrow" },
      color: "#ffffff",
      minwidth: 0
    },
    {
    note: {
      label: "The most consistent voting pattern, 141 points awarded over xx Contests",
      title: "Belarus to Russia"
    },
    data: { search: 119, tele: 141},
    dy: -1,
    dx: -180,
    connector: { end: "arrow" },
    subject: {
    },
    color: "#ffffff",
    minwidth: 500
  },{
    note: {
      label: "The most consistent search activity",
      title: "Cyprus to Greece"
    },
    data: { search: 142, tele: 140},
    dy: 100,
    dx: -1,
    subject: {
    },
    color: "#ffffff",
    minwidth: 500
  },
  {
    note: {
      label: "Moldova doesn't search much for Romanian candidates, but votes a lot for them",
      title: "Moldova to Romania"
    },
    data: { search: 66, tele: 137},
    dy: 70,
    dx: -1,
    subject: {
    },
    color: "#ffffff",
    minwidth: 600
  },
  {
    note: {
      label: "Romania returns the favour to Moldova, with slightly more search and a little less televoting",
      title: "Romania to Moldova"
    },
    data: { search: 88, tele: 118},
    dy: 50,
    dx: -1,
    subject: {
    },
    color: "#ffffff",
    minwidth: 700
  },
  {
    note: {
      label: "Sweden is often at the receiving end of televoting points awarded from other Nordic countries",
      title: "Finland to Sweden"
    },
    data: { search: 129, tele: 105},
    dy: 50,
    dx: 1,
    subject: {
    },
    color: "#ffffff",
    minwidth: 600
  },
  {
    note: {
      label: "A big Turkish diaspora drives searches and televoting from Germany and other countries like Belgium and France",
      title: "Germany to Turkey",
      wrap: 200
    },
    data: { search: 64, tele: 84},
    dy: 0,
    dx: 200,
    subject: {
    },
    color: "#ffffff",
    minwidth: 600
  },
  {
    note: {
      label: "A high search activity for Greek participants in Turkey does not result in many televoting points",
      title: "Turkey to Greece"
    },
    data: { search: 91, tele: 43},
    dy: -200,
    dx: 50,
    subject: {
    },
    color: "#ffffff",
    minwidth: 600
  },
  {
    note: {
      label: "The lowest televoting to search activity ratio is recorded by the Belgians, awarding points to France",
      title: "Belgium to France"
    },
    data: { search: 110, tele: 42},
    dy: 60,
    dx: 1,
    subject: {
    },
    color: "#ffffff",
    minwidth: 400
  }
]
  let annotToRender = annotations.filter((anot) => anot.minwidth < windowWidth)

  const makeAnnotations = annotation()
    .notePadding(15)
    .type(type)
    .annotations(annotToRender)
    .textWrap(150)
    .accessors({
      x: d => scatterPatternScaleX(d.search),
      y: d => scatterPatternScaleY(d.tele)
    });

  scatterPatternSvg.append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations)

  let patternMarkers = scatterPatternSvg.selectAll("g.vote-icon")
    .data(patterns)
    .enter().append("g")
    .attr("class", "vote-icon")
    .attr("transform", (d) => `translate(${scatterPatternScaleX(d.search)  - (30 + countryheight)/2},${scatterPatternScaleY(d.tele) - countryheight/2})`)
    .style("opacity", 1)
    .style("filter", "url(#glow)")
    .on("mouseover", function(d) {	
      tooltip.transition()		
          .duration(200)		
          .style("opacity", .9);		
      tooltip.html(`<strong>${grid[d.from].name} to ${grid[d.to].name}</strong> <br/>
                    Search: ${Math.round(d.search)} points<br/>
                    Televoting: ${Math.round(d.tele)} points`)	
          .style("left", (d3.event.pageX + 28) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })
    .on("mousemove", function(){
      tooltip
        .style("left", (d3.event.pageX + 28) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");
    })					
    .on("mouseout", function(d) {		
      tooltip.transition()		
          .duration(500)		
          .style("opacity", 0);	
    });
  patternMarkers.append('path')
    .attr("d", d3.symbol().type(d3.symbolTriangle))
    .attr("transform", "translate(26,12) rotate(90)")
    .style("fill", "white");
  patternMarkers.append("image")
    .attr("xlink:href", function (d) { return "assets/images/flags/" + d.from + ".svg" })
    .attr('width', countryheight)
    .attr('height', countryheight);
  patternMarkers.append("image")
    .attr("xlink:href", function (d) { return "assets/images/flags/" + d.to + ".svg" })
    .attr("x", 30)
    .attr('width', countryheight)
    .attr('height', countryheight);
  
  });

}

export default { init, resize };
