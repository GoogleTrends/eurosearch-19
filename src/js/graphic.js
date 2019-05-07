import { separate, combine, splitPathString} from "flubber";
import { layoutTextLabel, layoutGreedy, layoutAnnealing, layoutLabel, layoutRemoveOverlaps } from 'd3fc-label-layout';
import { annotation, annotationCalloutRect, annotationCallout } from 'd3-svg-annotation';

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
      ROU: {"coords": { x: 6, y: 5 }, "name": "Romania"},
      RUS: {"coords": { x: 7, y: 3 }, "name": "Russia"},
      SMR: {"coords": { x: 2, y: 6 }, "name": "San Marino"},
      SRB: {"coords": { x: 6, y: 6 }, "name": "Serbia"},
      SVK: {"coords": { x: 5, y: 4 }, "name": "Slovakia"},
      SVN: {"coords": { x: 3, y: 6 }, "name": "Slovenia"},
      SWE: {"coords": { x: 5, y: 0 }, "name": "Sweden"},
      UKR: {"coords": { x: 6, y: 4 }, "name": "Ukraine"},
      TUR: {"coords": { x: 8, y: 6 }, "name": "Turkey"}
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
    
    let filtervalues = {
      "country": "ISR",
      "fromto": "to",
      "searchtele": "search"
    }
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

    let tofromCountries ={
      "to": tos,
      "from": froms
    }
    
    d3.select("#countrylist").selectAll("option")
      //.data(tofromCountries[filtervalues.fromto])
      .data(froms)
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
      .html(function (d, i) { return (i + 1) + '. ?'; });

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
    .style("fill", "#0D1730");
    //.style("filter", "url(#glow)");

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
  const rectDim = 64;
  const gridMarginX = (mapWidth/2 - 5*rectDim)/rectDim;
  const gridMarginY = 120/rectDim;
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
        //.style("filter", "url(#glow)");
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
  let scatterRatio = 2/3;
  const scatterHeight = scatterWidth * scatterRatio;

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
    .attr("y", scatterInnerHeight + 20)
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

  scatterOverallSvg.append("path")
    .attr("d", `M${scatterScaleX(10)},${scatterScaleY(0)} L${scatterScaleX(210)},${scatterScaleY(0)} L${scatterScaleX(210)},${scatterScaleY(200)} L${scatterScaleX(10)},${scatterScaleY(0)}`)
    .style("fill", "#ffffff")
    .style("stroke", "#ffffff")
    .style("stroke-width", 4)
    .style("filter", "url(#glow)")
    .style("opacity", 0.2);

  scatterOverallSvg.append("path")
    .attr("d", `M${scatterScaleX(0)},${scatterScaleY(10)} L${scatterScaleX(190)},${scatterScaleY(200)} L${scatterScaleX(0)},${scatterScaleY(200)} L${scatterScaleX(0)},${scatterScaleY(10)}`)
    .style("fill", "#ffffff")
    .style("stroke", "#ffffff")
    .style("stroke-width", 4)
    .style("filter", "url(#glow)")
    .style("opacity", 0.2);

  scatterOverallSvg.append("text")
    .attr("x", scatterScaleX(150))
    .attr("y", scatterScaleY(30))
    .text("More search activity than televoting")
    .style("fill", "#ffffff")
    .style("text-anchor", "middle")
    .attr("class", "annotation");

  scatterOverallSvg.append("text")
    .attr("x", scatterScaleX(5))
    .attr("y", scatterScaleY(180))
    .text("More televoting than search activity")
    .style("fill", "#ffffff")
    .style("text-anchor", "start")
    .attr("class", "annotation");

  scatterOverallSvg.selectAll("circle")
    .data(pointsMean)
    .enter().append("circle")
    .attr("cx", (d) => scatterScaleX(d.value.searchpoints))
    .attr("cy", (d) => scatterScaleY(d.value.votepoints))
    .attr("r", 5)
    .attr("class", "circle-mean")
    .style("filter", "url(#glow)")
    .attr("id", (d) => d.key);

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
        return -d3.select(this.parentNode).attr("layout-height")/2 - 3;
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

  scatterYearlySvg.append("path")
    .attr("d", `M${scatterYearlyScaleX(10)},${scatterYearlyScaleY(0)} L${scatterYearlyScaleX(maxYearlyPoints)},${scatterYearlyScaleY(0)} L${scatterYearlyScaleX(maxYearlyPoints)},${scatterYearlyScaleY(maxYearlyPoints - 10)} L${scatterYearlyScaleX(10)},${scatterYearlyScaleY(0)}`)
    .style("fill", "#ffffff")
    .style("stroke", "#ffffff")
    .style("stroke-width", 4)
    .style("filter", "url(#glow)")
    .style("opacity", 0.2);

  scatterYearlySvg.append("path")
    .attr("d", `M${scatterYearlyScaleX(0)},${scatterYearlyScaleY(10)} L${scatterYearlyScaleX(maxYearlyPoints - 10)},${scatterYearlyScaleY(maxYearlyPoints)} L${scatterYearlyScaleX(0)},${scatterYearlyScaleY(maxYearlyPoints)} L${scatterYearlyScaleX(0)},${scatterYearlyScaleY(10)}`)
    .style("fill", "#ffffff")
    .style("stroke", "#ffffff")
    .style("stroke-width", 4)
    .style("filter", "url(#glow)")
    .style("opacity", 0.2);
    
  scatterYearlySvg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${scatterInnerHeight})`)
    .call(xYearlyAxis);
  scatterYearlySvg.append("text")
    .text("Search activity points")
    .attr("x", scatterInnerWidth)
    .attr("y", scatterInnerHeight + 20)
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
    
  let yearlyCircles = scatterYearlySvg.selectAll("circle")
    .data(points)
    .enter().append("circle")
    .attr("cx", (d) => scatterYearlyScaleX(d.searchpoints))
    .attr("cy", (d) => scatterYearlyScaleY(d.votepoints))
    .attr("r", 2)
    .attr("class", (d) => `circle-year circle-${d.year} circle-${d.to}`)
    .attr("id", (d) => d.key);

  let yearTitle = scatterYearlySvg.append("text")
      .attr("x", scatterInnerWidth/2)
      .attr("y", -16)
      .text("2018")
      .attr("class", "yearly-title");
  
  let winnerText = scatterYearlySvg.append("text")
      .attr("x", scatterInnerWidth * 9/10)
      .attr("y", 30)
      .attr("class", "winner-highlight")
      .text("Winner");
  
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
    winnerText.classed("winner-highlight", false);
    yearlyCircles.classed("winner-highlight", false).style("filter", "none").transition().duration(1000)
      .attr("r", 4)
      .style("opacity", 0.1);
    let winner = winners[yr];
    
    //Sync winner animation
    requestAnimationFrame(() => { startAnimation() })
    let startAnimation = function(){
      scatterYearlySvg.select(`.circle-${yr}.circle-${winner}`).classed("winner-highlight", true);
      winnerText.classed("winner-highlight", true);
    }

    scatterYearlySvg.selectAll(".circle-" + yr).transition().duration(1000)
      .attr("r", 10)
      .style("opacity", 0.8)
      .style("filter", "url(#glow)")
      .on("end", function() {
        scatterYearlySvg.datum(points.filter((el) => el.year == yr))
          .call(labelsYearly)
        
        scatterYearlySvg.selectAll("g.label text")
          .attr("dx", function(d) {
            return -d3.select(this.parentNode).attr("layout-width")/2;
          })
          .attr("dy", function(d) {
            return -d3.select(this.parentNode).attr("layout-height")/2 - 5;
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
  scatterPatternSvg.append("text")
    .text("MORE TELEVOTING POINTS")
    .attr("x", scatterPatternScaleX(30) + 75)
    .attr("y", 0)
    .style("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .style("font-size", "0.7em")
    .attr("class", "y axis-title");
    
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
        label: "",
        padding: 0,
        wrap: 200
      },
      data: { search: 30.5, tele: maxPatternPoints + 3},
      dy: -1,
      dx: -190,
      connector: { end: "arrow" },
      color: "#ffffff"
    },
    {
      note: {
        label: "LINE OF EQUAL SEARCH AND TELEVOTING POINTS",
        padding: 0
      },
      data: { search: maxPatternPoints + 3, tele: maxPatternPoints + 3},
      dy: -1,
      dx: -100,
      connector: { end: "arrow" },
      color: "#ffffff"
    },
    {
      note: {
        label: "MORE SEARCH ACTIVITY",
        padding: 0
      },
      data: { search: 50, tele: maxPatternPoints + 3},
      dy: -1,
      dx: -50,
      connector: { end: "arrow" },
      color: "#ffffff"
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
    color: "#ffffff"
  },{
    note: {
      label: "The most consistent search activity",
      title: "Cyprus to Greece"
    },
    data: { search: 142, tele: 140},
    dy: 200,
    dx: -1,
    subject: {
    },
    color: "#ffffff"
  },
  {
    note: {
      label: "Moldova doesn't search much for Romanian candidates, but votes a lot for them",
      title: "Moldova to Romania"
    },
    data: { search: 66, tele: 137},
    dy: 100,
    dx: -1,
    subject: {
    },
    color: "#ffffff"
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
    color: "#ffffff"
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
    color: "#ffffff"
  },
  {
    note: {
      label: "A big Turkish diaspora drives searches and televoting from Germany and other countries like Belgium and France",
      title: "Germany to Turkey"
    },
    data: { search: 64, tele: 84},
    dy: 0,
    dx: 300,
    subject: {
    },
    color: "#ffffff"
  },
  {
    note: {
      label: "A high search activity for Greek participants in Turkey does not result in many televoting points",
      title: "Turkey to Greece"
    },
    data: { search: 91, tele: 43},
    dy: -200,
    dx: 1,
    subject: {
    },
    color: "#ffffff"
  },
  {
    note: {
      label: "A high search activity for Greek participants in Turkey does not result in many televoting points",
      title: "Turkey to Greece"
    },
    data: { search: 91, tele: 43},
    dy: -200,
    dx: 1,
    subject: {
    },
    color: "#ffffff"
  },
  {
    note: {
      label: "The lowest televoting to search activity ratio is recorded by the Belgians, awarding points to France",
      title: "Belgium to France"
    },
    data: { search: 110, tele: 42},
    dy: 100,
    dx: 1,
    subject: {
    },
    color: "#ffffff"
  }
]
  const makeAnnotations = annotation()
    .notePadding(15)
    .type(type)
    .annotations(annotations)
    .textWrap(150)
    .accessors({
      x: d => scatterPatternScaleX(d.search),
      y: d => scatterPatternScaleY(d.tele)
    });

  scatterPatternSvg.append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations)
  
  d3.select(".annotations .annotation .annotation-connector").attr("transform", "rotate(-90)");

  let patternMarkers = scatterPatternSvg.selectAll("g.vote-icon")
    .data(patterns)
    .enter().append("g")
    .attr("transform", (d) => `translate(${scatterPatternScaleX(d.search)  - (30 + countryheight)/2},${scatterPatternScaleY(d.tele) - countryheight/2})`)
    .style("opacity", 1)
    .style("filter", "url(#glow)");
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
