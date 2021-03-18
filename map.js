const height = window.innerHeight / 2
const width = window.innerWidth / 2

// http-server -c-1 &

// Função geradora de cores
let randomColor = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  // console.log(color)
  return color;
}

// Container
let svg = d3.select("#map")
  .append("svg")
  .attr("height", height)
  .attr("width", width)

// Titulo
let tooltip = d3.select("#map").append("div").attr('class', 'hidden tooltip');

// Projecao
const projection = d3.geoMercator()
  .scale(1)

// Path
const path = d3.geoPath()
  .projection(projection)

// d3.json("data.json").then((mapData) => {
d3.json("http://servicodados.ibge.gov.br/api/v2/malhas/35?resolucao=5&formato=application/vnd.geo+json").then((mapData) => {
  // d3.json("http://servicodados.ibge.gov.br/api/v3/malhas/estados/SP?intrarregiao=municipio&qualidade=minima&formato=application/vnd.geo+json").then((mapData) => {
  console.log(mapData)

  // Converte topoJSON para geoJSON
  // let geo = topojson.feature(topo, topo.objects.data)

  // Limites do mapa
  let bounds = path.bounds(mapData)
  bounds = [[479.07309403150936, 250.35229148850092], [479.229239913039, 250.45685275177792]]
  console.log(bounds)
  const border = 0.95
  let scale = border / Math.max((bounds[1][0] - bounds[0][0]) / width, (bounds[1][1] - bounds[0][1]) / height);
  projection.scale(scale);

  bounds = d3.geoBounds(mapData)
  bounds = [[-53.1078, -25.31], [-44.1613, -19.7798]]
  console.log(bounds)
  projection.center([(bounds[1][0] + bounds[0][0]) / 2, (bounds[1][1] + bounds[0][1]) / 2]);
  projection.translate([width / 2, height / 2]);

  // Aplica as formas no SVG
  // svg.append("path")
  //   .datum(mapData)
  //   .style("stroke", "black")
  //   .style("stroke-width", "0.5")
  //   .style("fill", "none")
  //   .attr("d", path)

  // Aplica as formas no SVG
  svg.selectAll(".city")
    .data(mapData.features)
    .enter()
    .append("path")
    .attr("class", (d) => {
      // return "city " + d.properties.CD_MUN
      return "city " + d.properties.codarea
    })
    .attr("d", path)

    // Mostra titulo
    .on('mouseover', function (d) {
      var mouse = d3.mouse(svg.node()).map(function (d) {
        return parseInt(d);
      });
      tooltip.classed('hidden', false)
        .attr('style', 'left:' + (mouse[0] + 15) +
          'px; top:' + (mouse[1] - 35) + 'px')
        // .html(d.properties.codarea)
        .html(() => {
          return $('.' + d.properties.codarea).text()
        })
    })

    // Esconde titulo
    .on('mouseout', function () {
      tooltip.classed('hidden', true);
    })

    // Cor aleatoria
    .style("fill", randomColor)
  // .style("fill", "none")
})

// Nomes das cidades
d3.json('data.json').then((data) => {
  console.log(data)
  data.features.forEach(e => {
    cod = e.properties.CD_MUN
    nome = e.properties.NM_MUN

    $('.' + cod).text(nome)
  });
})

//Zoom
const zoom = d3.zoom()
  .scaleExtent([1, 10])
  .on("zoom", () => {
    // console.log(d3.event)
    svg.selectAll("path").attr("transform", d3.event.transform)
  })

svg.call(zoom)
