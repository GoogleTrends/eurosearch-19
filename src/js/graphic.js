/* global d3 */
function resize() {}

function init() {

  d3.dsv(",", "assets/data/ranking.csv", function(d) {
    return {
      country: d.country,
      search: +d.search,
      tele: +d.tele,
      overall: +d.overall
    };
  }).then(function(rankingdata) {
    const rankingHeight = 800;
    const rankingWidth = 600;
    const rankingMargin = {top: 40, left: 100};

    let rankingSvg = d3.select("#ranking")
      .attr("width", rankingWidth) 
      .attr("height", rankingHeight)
    
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
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-family', 'Roboto');

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
      .attr('height', countryheight - 2);
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
      .style('font-family', 'Roboto')
      .style('font-size', '14px')
      .attr('class', function (d) { return 'countrylabel id-' + d.country; })
      .attr('id', function (d) { return d.key; })
      .style('fill', '#000037')
      .html(function (d, i) { return (i + 1) + '. ' + d.country; });

  });

}

export default { init, resize };
