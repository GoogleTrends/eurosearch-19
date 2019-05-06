/* global d3 */
import { separate, combine, splitPathString} from "flubber";
import noUiSlider from 'nouislider';

function resize() {}

function init() {

  Promise.all([
    d3.dsv(",", "assets/data/ranking.csv", function(d) {
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
    d3.dsv(",", "assets/data/votingdata_18.csv", function(d){
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
      ALB: {"coords": { x: 5, y: 8 }, "name": "Albania"},
      ARM: {"coords": { x: 9, y: 6 }, "name": "Armenia"},
      AUS: {"coords": { x: 9, y: 9 }, "name": "Australia"},
      AUT: {"coords": { x: 4, y: 5 }, "name": "Austria"},
      AZE: {"coords": { x: 9, y: 5 }, "name": "Azerbaijan"},
      BEL: {"coords": { x: 2, y: 3 }, "name": "Belgium"},
      BGR: {"coords": { x: 7, y: 6 }, "name": "Bulgaria"},
      BIH: {"coords": { x: 5, y: 6 }, "name": "Bosnia and Herzegovina"},
      BLR: {"coords": { x: 6, y: 3 }, "name": "Belarus"},
      CHE: {"coords": { x: 3, y: 4 }, "name": "Switzerland"},
      CYP: {"coords": { x: 8, y: 7 }, "name": "Cyprus"},
      CZE: {"coords": { x: 4, y: 4 }, "name": "Czechia"},
      DEU: {"coords": { x: 4, y: 3 }, "name": "Germany"},
      DNK: {"coords": { x: 4, y: 2 }, "name": "Denmark"},
      ESP: {"coords": { x: 1, y: 5 }, "name": "Spain"},
      EST: {"coords": { x: 6, y: 1 }, "name": "Estonia"},
      FIN: {"coords": { x: 6, y: 0 }, "name": "Finland"},
      FRA: {"coords": { x: 1, y: 4 }, "name": "France"},
      GBR: {"coords": { x: 1, y: 2 }, "name": "UK"},
      GEO: {"coords": { x: 8, y: 5 }, "name": "Georgia"},
      GRC: {"coords": { x: 6, y: 8 }, "name": "Greece"},
      HUN: {"coords": { x: 5, y: 5 }, "name": "Hungaria"},
      HRV: {"coords": { x: 4, y: 6 }, "name": "Croatia"},
      IRL: {"coords": { x: 0, y: 2 }, "name": "Ireland"},
      ISL: {"coords": { x: 0, y: 0 }, "name": "Iceland"},
      ISR: {"coords": { x: 8, y: 8 }, "name": "Israel"},
      ITA: {"coords": { x: 3, y: 5 }, "name": "Italia"},
      KOS: {"coords": { x: 6, y: 7 }, "name": "Kosovo"},
      LTU: {"coords": { x: 6, y: 2 }, "name": "Lithuania"},
      LUX: {"coords": { x: 2, y: 4 }, "name": "Luxembourg"},
      LVA: {"coords": { x: 7, y: 2 }, "name": "Latvia"},
      MDA: {"coords": { x: 7, y: 5 }, "name": "Moldova"},
      MKD: {"coords": { x: 7, y: 7 }, "name": "North Macedonia"},
      MLT: {"coords": { x: 1, y: 7 }, "name": "Malta"},
      MNE: {"coords": { x: 5, y: 7 }, "name": "Montenegro"},
      NLD: {"coords": { x: 3, y: 3 }, "name": "Netherlands"},
      NOR: {"coords": { x: 4, y: 0 }, "name": "Norway"},
      POL: {"coords": { x: 5, y: 3 }, "name": "Poland"},
      PRT: {"coords": { x: 0, y: 5 }, "name": "Portugal"},
      ROU: {"coords": { x: 6, y: 5 }, "name": "Roumania"},
      RUS: {"coords": { x: 7, y: 3 }, "name": "Russia"},
      SMR: {"coords": { x: 2, y: 6 }, "name": "San Marino"},
      SRB: {"coords": { x: 6, y: 6 }, "name": "Serbia"},
      SVK: {"coords": { x: 5, y: 4 }, "name": "Slovakia"},
      SVN: {"coords": { x: 3, y: 6 }, "name": "Slovenia"},
      SWE: {"coords": { x: 5, y: 0 }, "name": "Sweden"},
      UKR: {"coords": { x: 6, y: 4 }, "name": "Ukraine"},
      TUR: {"coords": { x: 8, y: 6 }, "name": "Turkey"}
    }
    
    let filtervalues = {
      "country": "ISR",
      "fromto": "to",
      "searchtele": "search"
    }
    /** SELECT LIST **/
    let froms = [...new Set(votingdata.map(el => el.from))];
    let tos  = [...new Set(votingdata.map(el => el.to))];

    let tofromCountries ={
      "to": tos,
      "from": froms
    }
    
    d3.select("#countrylist").selectAll("option")
      .data(tofromCountries[filtervalues.fromto])
      .enter().append("option")
      .attr("value", (d) => d)
      .text((d) => grid[d].name);
    d3.select("option[value='ISR']").property("selected", true);
    
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
      .domain(rankingdata.map((d) => d.country))
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
      .attr('font-family', 'Rubik');

    const countryheight = 24;

    //Connecting lines
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
      .attr("y", (d) => countryScale(d.country) - countryheight/2)
      .attr('class', function (d) { return 'id-' + d.Country; })
      .attr('width', countryheight - 2)
      .attr('height', countryheight - 2)
      .style("filter", "url(#flagglow)");
    rankingSvg.selectAll('image.question.tele')
      .data(rankingdata)
      .enter().append('image')
      .attr("xlink:href", function (d) { return 'assets/images/help-circle' + '.svg' })
      .attr('x', voteScale("tele") - countryheight/2)
      .attr('y', (d) => countryScale(d.country) - countryheight/2)
      .attr('class', 'question')
      .attr('width', countryheight - 2)
      .attr('height', countryheight - 2);
    rankingSvg.selectAll('image.question.overall')
      .data(rankingdata)
      .enter().append('image')
      .attr("xlink:href", function (d) { return 'assets/images/help-circle' + '.svg' })
      .attr('x', voteScale("overall") - countryheight/2)
      .attr('y', (d) => countryScale(d.country) - countryheight/2)
      .attr('class', 'question')
      .attr('width', countryheight - 2)
      .attr('height', countryheight - 2);
  rankingSvg.selectAll('text.countrylabel-left')
      .data(rankingdata)
      .enter().append('text')
      .attr('x', 0)
      .attr('y', (d) => countryScale(d.country))
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
      .attr('y', (d) => countryScale(d.country))
      .attr("dy", "0.3em")
      .style('font-family', 'Rubik')
      .style('font-size', '14px')
      .style('text-anchor', 'end')
      .attr('class', function (d) { return 'countrylabel id-' + d.country; })
      .attr('id', function (d) { return d.key; })
      //.html(function (d, i) { return (i + 1) + '. ' + d.country; });
      .html(function (d, i) { return (i + 1) + '. ???'; });

  /** MAP **/
  //const mapWidth = 900;
  const mapWidth = document.querySelector("#map-container").clientWidth;
  const mapHeight = 800;
  const mapPadding = 20;
  let mapSvg = d3.select("#map")
    .attr("width", mapWidth)
    .attr("height", mapHeight);

    let extent = {
      'type': 'Feature',
      'geometry': {
      'type': 'Polygon',
      'coordinates': [[[10, 70], [35, 70], [10, 30], [35, 30]]]
      }
    }
  const projection = d3.geoAzimuthalEqualArea()
    .rotate([-10,-52,0]);
  projection.fitExtent([[mapPadding, mapPadding + 25], [mapWidth - mapPadding, mapHeight - mapPadding]], extent);

  const geoPath = d3.geoPath()
    .projection(projection);

  let countries = mapSvg.selectAll('path')
    .data(geodata.features)
    .enter().append('path')
    .attr("id", (d) => d.properties.ADM0_A3)
    .attr("class", "country")
    .attr("d", geoPath)
    .style("fill", "#0D1730")
    .style("filter", "url(#glow)");

  /*COLOR MAP*/
  const cols = d3.scaleSequential(d3.interpolatePlasma)
    .domain([1,12]);

  //legend
  d3.selectAll('.legend-item')
    .style('background-color', function (d) {
        return cols(d3.select(this).text());
    });

  function getCountryVotingData(filterparams) {
    let countryVotingData = votingdata.filter((el) => el[filterparams.fromto] == filterparams.country)
    let countryVoting = countryVotingData.map(el => {
      const obj = {};
      obj.to = el.to;
      obj.from = el.from;
      obj.points = el[filterparams.searchtele];
      return obj;
    })
    //countryVoting = countryVoting.filter((cntr) => cntr.points > 0)
    return countryVoting;
  }

  function colorMap(filterparams){
    let countrydata = getCountryVotingData(filterparams);
    let reversefromto = "from";
    if(filterparams.fromto == "from"){
      reversefromto = "to"
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
  const rectDim = 48;
  const gridMargin = 120/rectDim;
  function rectToPath(x, y, dim){
    x = x + gridMargin;
    y = y + gridMargin;
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
    d3.select(".country#" + filtervalues.country).raise().classed("highlight", true);
    colorMap(filtervalues);
  })

  d3.selectAll("input.fromtoswitch").on("change", function(){
    filtervalues.fromto = d3.select(this).node().value;
    d3.selectAll("#countrylist option").remove();
    d3.select("#countrylist").selectAll("option")
      .data(tofromCountries[filtervalues.fromto])
      .enter().append("option")
      .attr("value", (d) => d)
      .text((d) => grid[d].name);
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

  const scatterWidth = document.querySelector("#scatter-container").clientWidth * 0.8;
  let scatterRatio = 2/3;
  const scatterHeight = scatterWidth * scatterRatio;
  //const scatterWidth = 800;
  //const scatterHeight = 600;

  const scatterMargins = {top: 30, right: 40, bottom: 60, left: 40};

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
    .range([0,scatterWidth - scatterMargins.right]);
  
  let scatterScaleY = d3.scaleLinear()
    .domain([0,maxPoints])
    .range([scatterHeight - scatterMargins.bottom, scatterMargins.top]);

  let xAxis = d3.axisBottom(scatterScaleX)
    .tickValues([50,100,150])
    .tickSize(-scatterHeight);
  let yAxis = d3.axisLeft(scatterScaleY)
    .tickValues([50,100,150,200])
    .ticks(5)
    .tickSize(-scatterWidth);

  scatterOverallSvg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${scatterHeight - scatterMargins.bottom})`)
    .call(xAxis);
  scatterOverallSvg.append("text")
    .text("Search activity points")
    .attr("x", scatterWidth/2)
    .attr("y", scatterHeight - 36)
    .attr("class", "x axis-title")
  scatterOverallSvg.append("text")
    .text("Televoting points")
    .attr("x", -20)
    .attr("y", -12)
    .attr("class", "y axis-title")

  scatterOverallSvg.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(0,0)`)
    .call(yAxis);

  /*scatterOverallSvg.append("line")
    .attr("x1", scatterScaleX(0))
    .attr("x2", scatterScaleX(200))
    .attr("y1", scatterScaleY(0))
    .attr("y2", scatterScaleY(200))
    .attr("class", "fourtyfive")*/

  scatterOverallSvg.append("path")
    .attr("d", `M${scatterScaleX(10)},${scatterScaleY(0)} L${scatterScaleX(200)},${scatterScaleY(0)} L${scatterScaleX(200)},${scatterScaleY(190)} L${scatterScaleX(10)},${scatterScaleY(0)}`)
    .style("fill", "none")
    .style("stroke", "#ffffff")
    .style("stroke-width", 2)
    .style("filter", "url(#glow)")

  scatterOverallSvg.append("path")
    .attr("d", `M${scatterScaleX(0)},${scatterScaleY(10)} L${scatterScaleX(190)},${scatterScaleY(200)} L${scatterScaleX(0)},${scatterScaleY(200)} L${scatterScaleX(0)},${scatterScaleY(10)}`)
    .style("fill", "none")
    .style("stroke", "#ffffff")
    .style("stroke-width", 2)
    .style("filter", "url(#glow)")

  scatterOverallSvg.append("text")
    .attr("x", scatterScaleX(150))
    .attr("y", scatterScaleY(30))
    .text("More search activity than televoting")
    .style("fill", "#ffffff")
    .style("text-anchor", "middle");

  scatterOverallSvg.append("text")
    .attr("x", scatterScaleX(5))
    .attr("y", scatterScaleY(180))
    .text("More televoting than search activity")
    .style("fill", "#ffffff")
    .style("text-anchor", "start");

  scatterOverallSvg.selectAll("circle")
    .data(pointsMean)
    .enter().append("circle")
    .attr("cx", (d) => scatterScaleX(d.value.searchpoints))
    .attr("cy", (d) => scatterScaleY(d.value.votepoints))
    .attr("r", 5)
    .attr("class", "circle-mean")
    .style("filter", "url(#glow)")
    .attr("id", (d) => d.key);

  let scatterLabels = [
    {"RUS": "end"},
    {"BGR": "middle"},
    {"SRB": "middle"},
    {"SWE": "start"},
    {"CZE": "start"}
  ]

  let labeldata = pointsMean.filter((d) => {
    return d.key == "RUS" || d.key == "BGR" || d.key == "SRB" || d.key == "SWE" || d.key == "CZE"  || d.key == "ITA" || d.key == "TRK" || d.key == "UKR"
  })

  scatterOverallSvg.selectAll("text.label")
    .data(labeldata)
    .enter().append("text")
    .attr("x", (d) => scatterScaleX(d.value.searchpoints))
    .attr("y", (d) => scatterScaleY(d.value.votepoints))
    .text((d) => grid[d.key].name)
    .attr("class", "scatter-label")
    .attr("dy", -10);

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
    .range([0,scatterWidth - scatterMargins.right]);
      
  let scatterYearlyScaleY = d3.scaleLinear()
    .domain([0,maxYearlyPoints])
    .range([scatterHeight - scatterMargins.bottom, scatterMargins.top]);
 
  let xYearlyAxis = d3.axisBottom(scatterYearlyScaleX)
    .tickValues([100,200,300])
    .tickSize(-scatterHeight);
  let yYearlyAxis = d3.axisLeft(scatterYearlyScaleY)
    .tickValues([100,200,300])
    .ticks(5)
    .tickSize(-scatterWidth);
    
  scatterYearlySvg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${scatterHeight - scatterMargins.bottom})`)
    .call(xYearlyAxis);
  scatterYearlySvg.append("text")
    .text("Search activity points")
    .attr("x", scatterWidth - 50)
    .attr("y", scatterHeight - 30)
    .attr("class", "x axis-title")
  scatterYearlySvg.append("text")
    .text("Televoting points")
    .attr("x", -20)
    .attr("y", 10)
    .attr("class", "y axis-title")
    
  scatterYearlySvg.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(0,0)`)
    .call(yYearlyAxis);
    
  scatterYearlySvg.append("line")
    .attr("x1", scatterScaleX(0))
    .attr("x2", scatterScaleX(200))
    .attr("y1", scatterScaleY(0))
    .attr("y2", scatterScaleY(200))
    .attr("class", "fourtyfive")
    
  let yearlyCircles = scatterYearlySvg.selectAll("circle")
    .data(points)
    .enter().append("circle")
    .attr("cx", (d) => scatterYearlyScaleX(d.searchpoints))
    .attr("cy", (d) => scatterYearlyScaleY(d.votepoints))
    .attr("r", 2)
    .attr("class", (d) => "circle-year circle-" + d.year)
    .style("filter", "url(#glow)")
    .attr("id", (d) => d.key);

  function highlightYear(yr){
    yearlyCircles.classed("highlight", false);
    let highlighted = d3.selectAll(".circle-" + yr).classed("highlight", true);
  }

  var slider = document.getElementById('slider');

  noUiSlider.create(slider, {
      start: 2018,
      connect: true,
      tooltips: true,
      format: {
        to: function(value){
          return d3.format("(.0f")(value);
        },
        from: function(value){
          return value;
        }
      },
      step: 1,
      range: {
          'min': 2004,
          'max': 2018
      }
  });
  slider.noUiSlider.on("change", function(){
    highlightYear(+slider.noUiSlider.get());
  });

  /*SCATTER PATTERNS*/
  const maxSearchPatternPoints = d3.max(patterns, (d) => d.search);
  const maxVotePatternPoints = d3.max(patterns, (d) => d.tele);
  const maxPatternPoints = d3.max([maxSearchPatternPoints, maxVotePatternPoints]);

  let scatterPatternSvg = d3.select("svg#votingpattern")
    .attr("width", scatterWidth)
    .attr("height", scatterHeight)
    .append("g")
    .attr("transform", `translate(${scatterMargins.left},${scatterMargins.top})`);
      
  let scatterPatternScaleX = d3.scaleLinear()
    .domain([0,maxPatternPoints])
    .range([0,scatterWidth - scatterMargins.right]);
      
  let scatterPatternScaleY = d3.scaleLinear()
    .domain([0,maxPatternPoints])
    .range([scatterHeight - scatterMargins.bottom, scatterMargins.top]);
 
  let xPatternAxis = d3.axisBottom(scatterPatternScaleX)
    .tickValues([100,200,300])
    .tickSize(-scatterHeight);
  let yPatternAxis = d3.axisLeft(scatterPatternScaleY)
    .tickValues([100,200,300])
    .ticks(5)
    .tickSize(-scatterWidth);
    
  scatterPatternSvg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${scatterHeight - scatterMargins.bottom})`)
    .call(xPatternAxis);
  scatterPatternSvg.append("text")
    .text("Search activity points")
    .attr("x", scatterWidth - 50)
    .attr("y", scatterHeight - 30)
    .attr("class", "x axis-title")
  scatterPatternSvg.append("text")
    .text("Televoting points")
    .attr("x", -20)
    .attr("y", 10)
    .attr("class", "y axis-title")
    
  scatterPatternSvg.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(0,0)`)
    .call(yPatternAxis);
    
  scatterPatternSvg.append("line")
    .attr("x1", scatterPatternScaleX(0))
    .attr("x2", scatterPatternScaleX(200))
    .attr("y1", scatterPatternScaleY(0))
    .attr("y2", scatterPatternScaleY(200))
    .attr("class", "fourtyfive")
    
  let patternCircles = scatterPatternSvg.selectAll("circle")
    .data(patterns)
    .enter().append("circle")
    .attr("cx", (d) => scatterPatternScaleX(d.search))
    .attr("cy", (d) => scatterPatternScaleY(d.tele))
    .attr("r", (d) => Math.sqrt(d.tele))
    .attr("class", (d) => "circle-pattern circle-" + d.from + "-" + d.to)
    .style("filter", "url(#glow)");
    //.attr("id", (d) => d.key);

  });

}

export default { init, resize };
