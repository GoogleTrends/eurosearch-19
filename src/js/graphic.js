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
    let rankingSvg = d3.select("#ranking")
      .attr("width", 600) 
      .attr("height", 800)

      rankingSvg.append('text')
        .attr('x', 140)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('font-family', 'Roboto')
        .text('Search');
  
    rankingSvg.append('text')
      .attr('x', 240)
      .attr('y', 20)
      .attr('font-size', '16px')
      .attr('text-anchor', 'middle')
      .style('font-family', 'Roboto')
      .text('Televoting');

    rankingSvg.append('text')
      .attr('x', 360)
      .attr('y', 20)
      .attr('font-size', '16px')
      .attr('text-anchor', 'middle')
      .style('font-family', 'Roboto')
      .text('Overall');

  var countryheight = 24;
  //Connecting lines
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
  rankingSvg.selectAll('image')
      .data(rankingdata)
      .enter().append('image')
      .attr("xlink:href", function (d) { return 'assets/images/flags/' + d.country + '.svg' })
      .attr('x', 130)
      .attr('y', function (d, i) { return 30 + countryheight * i; })
      .attr('class', function (d) { return 'id-' + d.Country; })
      .attr('width', countryheight - 2)
      .attr('height', countryheight - 2);
  rankingSvg.selectAll('text.countrylabel')
      .data(rankingdata)
      .enter().append('text')
      .attr('x', 0)
      .attr('y', function (d, i) { return countryheight * i + 46; })
      .style('font-family', 'Roboto')
      .style('font-size', '14px')
      .attr('class', function (d) { return 'countrylabel id-' + d.country; })
      .attr('id', function (d) { return d.key; })
      .style('fill', '#000037')
      .html(function (d, i) { return (i + 1) + '. ' + d.country; });
  });
}

export default { init, resize };
