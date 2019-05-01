/* global d3 */
import { toRect, interpolate, combine, splitPathString} from "flubber";

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
    d3.json('assets/data/eurovis-countries-simplified-sanmarino.geojson'),
    d3.dsv(",", "assets/data/tele-search-by-year.csv", function(d) {
      return {
        to: d.to,
        searchpoints: +d.searchpoints,
        year: +d.year,
        votepoints: +d.votepoints
      };
    })
  ])
  .then(([rankingdata, geodata, points]) => {
    /**RANKING **/
    const rankingHeight = 800;
    const rankingWidth = 600;
    const rankingMargin = {top: 40, left: 100};

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
      .attr("stdDeviation","5")
      .attr("result","coloredBlur");
    let flagfeMerge = flagfilter.append("feMerge");
    flagfeMerge.append("feMergeNode")
      .attr("in","coloredBlur");
    flagfeMerge.append("feMergeNode")
      .attr("in","SourceGraphic");

    let countryScale = d3.scaleBand()
      .domain(rankingdata.map((d) => d.country))
      .range([rankingMargin.top, rankingHeight])
    let voteScale = d3.scaleBand()
      .domain(["search", "tele", "overall"])
      .range([rankingMargin.left, rankingWidth])

    rankingSvg.selectAll('text.header')
      .data(["search", "tele", "overall"])
      .enter().append("text")
      .attr('x', (d) => voteScale(d))
      .attr('y', 20)
      .text((d) => d)
      .attr("class", (d) => `label-${d}`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-family', 'Rubik');

    const countryheight = 24;

      //Connecting lines
    rankingSvg.selectAll("line.connection")
      .data(rankingdata)
      .enter()
      .append("line")
      .attr("class", "connection")
      .attr('x1', voteScale("search"))
      .attr('x2', voteScale("overall"))
      .attr('y1', (d) => countryScale(d.country))
      .attr('y2', (d) => countryScale(d.country))
      .style("stroke", "#cccccc")
      .style("stroke-width", 1);
  /*var connections = svgFive.selectAll('line.connection')
      .data(rankingconnect)
      .enter().append('line')
      .attr('class', function (d) { return 'connection id-' + d.key; })
      .attr('x1', 150)
      .attr('x2', 230)
      .attr('y1', function (d) { return countryheight*d.googlerank + 18; })
      .attr('y2', function (d) { return countryheight*d.realrank + 18; })
      .style('stroke', function(d){
          return '#eeeeee';
      })
      .style('stroke-width', 2);*/
      

  //Left part, search results
  rankingSvg.selectAll('image.flag')
      .data(rankingdata)
      .enter().append('image')
      .attr("xlink:href", function (d) { return 'assets/images/flags/' + d.country + '.svg' })
      .attr('x', voteScale("search") - countryheight/2)
      //.attr('y', function (d, i) { return 30 + countryheight * i; })
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
  rankingSvg.selectAll('text.countrylabel')
      .data(rankingdata)
      .enter().append('text')
      .attr('x', 0)
      .attr('y', (d) => countryScale(d.country))
      .attr("dy", "0.3em")
      .style('font-family', 'Rubik')
      .style('font-size', '14px')
      .attr('class', function (d) { return 'countrylabel id-' + d.country; })
      .attr('id', function (d) { return d.key; })
      //.style('fill', '#000037')
      .html(function (d, i) { return (i + 1) + '. ' + d.country; });

  /** MAP **/
  const mapWidth = 800;
  const mapHeight = 800;
  let mapSvg = d3.select("#map")
    .attr("width", mapWidth)
    .attr("height", mapHeight);
  const projection = d3.geoMercator()
    .center([20, 51])
    .scale(mapWidth * 0.65)
    .translate([mapWidth / 2, mapHeight / 2]);

  const path = d3.geoPath()
    .projection(projection);

  mapSvg.selectAll('path')
    .data(geodata.features)
    .enter().append('path')
    .attr("id", (d) => d.properties.ISO_A3)
    .attr("class", "country")
    .attr('d', path)
    .style("fill", "#cccccc")
    .style("stroke", "#ffffff")
    .style("stroke-width", 1);

  const grid = {
    ALB: { x: 5, y: 8 },
    ARM: { x: 9, y: 6 },
    AUS: { x: 9, y: 9 },
    AUT: { x: 4, y: 5 },
    AZE: { x: 9, y: 5 },
    BEL: { x: 2, y: 3 },
    BGR: { x: 7, y: 6 },
    BIH: { x: 5, y: 6 },
    BLR: { x: 6, y: 3 },
    CHE: { x: 3, y: 4 },
    CYP: { x: 8, y: 7 },
    CZE: { x: 4, y: 4 },
    DEU: { x: 4, y: 3 },
    DNK: { x: 4, y: 2 },
    ESP: { x: 1, y: 5 },
    EST: { x: 6, y: 1 },
    FIN: { x: 6, y: 0 },
    FRA: { x: 1, y: 4 },
    GBR: { x: 1, y: 2 },
    GEO: { x: 8, y: 5 },
    GRC: { x: 6, y: 8 },
    HUN: { x: 5, y: 5 },
    HRV: { x: 4, y: 6 },
    IRL: { x: 0, y: 2 },
    ISL: { x: 0, y: 0 },
    ISR: { x: 8, y: 8 },
    ITA: { x: 3, y: 5 },
    KOS: { x: 6, y: 7 },
    LTU: { x: 6, y: 2 },
    LUX: { x: 2, y: 4 },
    LVA: { x: 7, y: 2 },
    MDA: { x: 7, y: 5 },
    MKD: { x: 7, y: 7 },
    MLT: { x: 1, y: 7 },
    MNE: { x: 5, y: 7 },
    NLD: { x: 3, y: 3 },
    NOR: { x: 4, y: 0 },
    POL: { x: 5, y: 3 },
    PRT: { x: 0, y: 5 },
    ROU: { x: 6, y: 5 },
    RUS: { x: 7, y: 3 },
    SMR: { x: 2, y: 6 },
    SRB: { x: 6, y: 6 },
    SVK: { x: 5, y: 4 },
    SVN: { x: 3, y: 6 },
    SWE: { x: 5, y: 0 },
    UKR: { x: 6, y: 4 },
    TUR: { x: 8, y: 6 }
  }

  const rectDim = 48;
  function rectToPath(x, y, dim){
    return `M${x},${y} L${x + dim},${y} L${x + dim},${y + dim} L${x},${y + dim}`
  }

  d3.select("input#mapswitch").on("change", function(){
    if(this.checked){
      mapSvg.selectAll("path.country")
        .transition().duration(2000)
        .attrTween("d", function(d){
          console.log(rectToPath(grid[d3.select(this).attr("id")].x, grid[d3.select(this).attr("id")].y, rectDim));
          return combine(splitPathString(d3.select(this).attr("d")),
            rectToPath(grid[d3.select(this).attr("id")].x, grid[d3.select(this).attr("id")].y, rectDim)
          )
          /*return toRect(d3.select(this).attr("d"),
          grid[d3.select(this).attr("id")].x * rectDim,
          grid[d3.select(this).attr("id")].y * rectDim,
          rectDim,
          rectDim);*/
        });
    }
    if(!this.checked){
      mapSvg.selectAll("path.country")
        .transition().duration(2000)
        .attrTween("d", function(d){
          return interpolate(d3.select(this).attr("d"),path(d.geometry));
        });
    }
  })

  /*SCATTER TOTAL*/
  //Calculate total points awarded to each country over the 15 years
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

  const scatterWidth = 800;
  const scatterHeight = 600;

  const scatterMargins = {top: 20, right: 40, bottom: 40, left: 40};

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
    .domain([0,maxPoints])
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
    .attr("x", scatterWidth - 50)
    .attr("y", scatterHeight - 30)
    .attr("class", "x axis-title")
  scatterOverallSvg.append("text")
    .text("Televoting points")
    .attr("x", -20)
    .attr("y", 10)
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
    .attr("class", "fourtyfive")

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
    {"Russia": "end"},
    {"Bulgaria": "middle"},
    {"Serbia & Montenegro": "middle"},
    {"Sweden": "start"},
    {"Czech Republic": "start"}
  ]

  let labeldata = pointsMean.filter((d) => {
    return d.key == "Russia" || d.key == "Bulgaria" || d.key == "Serbia and Montenegro" || d.key == "Sweden" || d.key == "Czech Republic"  || d.key == "Italy" || d.key == "Turkey" || d.key == "Ukraine"
  })

  scatterOverallSvg.selectAll("text.label")
    .data(labeldata)
    .enter().append("text")
    .attr("x", (d) => scatterScaleX(d.value.searchpoints))
    .attr("y", (d) => scatterScaleY(d.value.votepoints))
    .text((d) => d.key)
    .attr("class", "scatter-label")
    .attr("dy", -10);

  });

}

export default { init, resize };
