const h2 = window.innerHeight / 2
const w2 = window.innerWidth

// http-server -c-1 &

d3.csv("data2.csv").then((tableData) => {

  // var loadDSV = d3.dsv(",", "text/csv; charset=ISO-8859-1");
  // console.log(loadDSV)
  // loadDSV("data2.csv", (d) => {
  //   return d;
  // }).then((tableData) => {
  console.log(tableData)

  var table = d3.select('#table')
    .append('table')
    .attr("height", h2)
    .attr("width", w2)

  var titles = d3.keys(tableData[0]);

  console.log(titles)

  var header = table.append('thead')
  header.append('tr')
    .selectAll('th')
    .data(titles)
    .append('th')
    .text(function (d) {
      return d;
    })

  var rows = table.append('tbody').selectAll('tr')
    .data(tableData).enter()
    .append('tr');

  rows.selectAll('td')
    .data(function (d) {
      return titles.map(function (k) {
        return { 'value': d[k], 'name': k };
      });
    }).enter()
    .append('td')
    .attr('data-th', function (d) {
      return d.name;
    })
    .text(function (d) {
      return d.value;
    });
});