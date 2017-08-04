const generateActiveUserNumbers = time => {
  const base = 50000;
  return {
    'time': time,
    'DAU': Math.floor(base * (1 + (Math.random() - 0.5) * 0.25)),
    'WAU': Math.floor(base * 1.2 * (1 + (Math.random() - 0.5) * 0.25)),
    'MAU': Math.floor(base * 1.5 * (1 + (Math.random() - 0.5) * 0.25)),
  };
};

const generate = (data, id, categories, axisNum) => {

  // get data prepared
  const parseTime = d3.timeParse("%H:%M");
  const formatNumber = d3.format(".3s");

  // calculate chart size based on window size
  const margin = { top: 20, right: 20, bottom: 40, left: 30 };
  const width = $(id).width() - margin.left - margin.right;
  const height = $(id).height() - margin.top - margin.bottom;

  // map time str to time object
  const ddata = data.map((ele, i) => ({
    'time': parseTime(ele['time']),
    'DAU': ele['DAU'],
    'WAU': ele['WAU'],
    'MAU': ele['MAU']
  }));

  const selected = $(".active-user-select").find(":selected").text();
  const option = categories[selected];

  // set the range and scale the range to data
  const x = d3.scaleTime().range([0, width])
              .domain(d3.extent(ddata, d => d.time));
                      // extent returns [min, max]
  // set y axis to be stable, which make it possible to display
  // all three series together
  const yMax = d3.max(ddata, d => d["MAU"]) * 1.1;
  const yMin = d3.min(ddata, d => d["DAU"]) * 0.9;
  const y = d3.scaleLinear().range([height, 0])
              .domain([yMin, yMax]);

  // defined axes
  const xAxis = d3.axisBottom(x)
      .ticks(d3.timeMinute.every(Math.floor(data.length / axisNum)))
      .tickSize(-height)
      .tickPadding([6]);

  const yAxis = d3.axisLeft(y)
      .ticks(10)
      .tickSize(-width)
      .tickFormat(formatNumber);

  // define the plotting
  const area = d3.area()
      .curve(d3.curveCardinal)
      .x(d => x(d.time))
      .y0(height)
      .y1(d => y(d[option]));

  // remove previous element
  d3.selectAll('.active-users').remove();

  // define svg
  const svg = d3.select(id).append("svg")
      .attr("id", "svg-active-users")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
     .attr("class", "x axis")
     .attr("id", "active-users-x-axis")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis);

  svg.append("g")
     .attr("class", "y axis")
     .call(yAxis);

  const path = svg.append("svg:path")
      .datum(ddata)
      .attr("class", "areaM")
      .attr("d", area);

  const points = svg.selectAll(".gPoints")
      .data(ddata)
      .enter().append("g")
      .attr("class", "gPoints");

  //legend rendering
  const legendSize = 8;
  const legendColor = 'rgba(0, 160, 233, 0.7)';

  const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform',
        'translate(0,' + (height + margin.bottom - legendSize) +')'
      );

  legend.append('rect')
      .attr('width', legendSize)
      .attr('height', legendSize)
      .attr('transform', 'translate(0, -5)')
      .style('fill', legendColor);

  legend.append('text')
      .data(ddata)
      .attr('x', legendSize * 1.2)
      .attr('y', legendSize / 2)
      .text(selected);

  points.selectAll(".usertipPoints")
      .data(ddata)
      .enter().append("circle")
      .attr("class", "usertipPoints")
      .attr("cx", d => x(d.time))
      .attr("cy", d => y(d[option]))
      .attr("r", "6px")
      .on("mouseover", function (d) {
        d3.select(this).transition().duration(100).style("opacity", 1);
        svg.append("g")
            .attr("class", "tipDot")
            .append("line")
            .attr("class", "tipDot")
            .transition()
            .duration(50)
            .attr("x1", x(d['time']))
            .attr("x2", x(d['time']))
            .attr("y2", height);

        svg.append("polyline")      // attach a polyline
            .attr("class", "tipDot")  // colour the line
            .style("fill", "black")     // remove any fill colour
            .attr("points", (x(d['time'])-3.5)+","+(y(1)-2.5)+","+x(d['time'])+","+(y(1)+6)+","+(x(d['time'])+3.5)+","+(y(1)-2.5));

        svg.append("polyline")      // attach a polyline
            .attr("class", "tipDot")  // colour the line
            .style("fill", "black")     // remove any fill colour
            .attr("points", (x(d['time'])-3.5)+","+(y(0)+2.5)+","+x(d['time'])+","+(y(0)-6)+","+(x(d['time'])+3.5)+","+(y(0)+2.5));

        $(this).tooltip({
          'container': 'body',
          'placement': 'left',
          'title': selected + ": " + formatNumber(d[option]),
          'trigger': 'hover'
        }).tooltip('show');
      })
      .on("mouseout",  function (d) {
        d3.select(this).transition().duration(100).style("opacity", 0);
        d3.selectAll('.tipDot').transition().duration(100).remove();
        $(this).tooltip('destroy');
      });

  const axisOpt = { x, y, xAxis, width, height };
  const svgAttr = { svg, points, area, path, legend };

  $(".active-user-select").change(() => {
    redraw(data, id, categories, axisOpt, svgAttr, 8);
  });

  return { axisOpt, svgAttr };
};


const redraw = (data, id, categories, axisOpt, svgAttr, axisNum) => {
  // get options and attributes
  const x = axisOpt["x"];
  const y = axisOpt["y"];
  const xAxis = axisOpt["xAxis"];
  const height = axisOpt["height"];
  const svg = svgAttr["svg"];
  const points = svgAttr["points"];
  const area = svgAttr["area"];
  const path = svgAttr["path"];

  //format of time data
  var parseTime = d3.timeParse("%H:%M");
  var formatNumber = d3.format(".0%");

  const ddata = data.map((ele, i) => ({
    'time': parseTime(ele['time']),
    'DAU': ele['DAU'],
    'WAU': ele['WAU'],
    'MAU': ele['MAU']
  }));

  const selected = $(".active-user-select").find(":selected").text();
  const option = categories[selected];

  x.domain(d3.extent(ddata, d => d.time));

  xAxis.ticks(d3.timeMinute.every(Math.floor(data.length / axisNum)));

  svg.select("#active-users-x-axis")
      .transition()
      .duration(200)
      .ease(d3.easeSin)
      .call(xAxis);

  // select ele with class legend then change legend text
  svg.selectAll(".legend text").text(selected);

  // update area
  area.x(d => x(d.time))
      .y0(height)
      .y1(d => y(d[option]));

  // update area line
  path.datum(ddata)
      .transition()
      .duration(200)
      .attr("class", "areaM")
      .attr("d", area);

  //circle updating
  points.selectAll(".usertipPoints")
      .data(ddata)
      .attr("class", "usertipPoints")
      .attr("cx", d => x(d.time))
      .attr("cy", d => y(d[option]))
      .attr("r", "6px");

  //draw new dot
  points.selectAll(".usertipPoints")
      .data(ddata)
      .enter().append("circle")
      .attr("class", "usertipPoints")
      .attr("cx", d => x(d.time))
      .attr("cy", d => y(d[option]))
      .attr("r", "6px");

  //remove old dot
  points.selectAll(".usertipPoints")
      .data(ddata)
      .exit()
      .transition()
      .duration(200)
      .remove();

};

//dynamic data and chart update
export const displayActiveUsers = () => {
  const minutes = ['10:01', '10:02', '10:03', '10:04',
    '10:05', '10:06', '10:07', '10:08', '10:09'];

  const activeUserData = minutes.map(m => generateActiveUserNumbers(m));

  const categories = {
    'Daily Active Users': "DAU",
    'Weekly Active Users': "WAU",
    'Monthly Active Users': "MAU",
  };

  let hAxis = 10;
  let mAxis = 10;

  const id = "#active-users";

  const sca = new generate(activeUserData, id, categories, 8);

  const interval = setInterval(() => {
    //update input data
    activeUserData.push(generateActiveUserNumbers(hAxis + ":" + mAxis));

    // pseudo time update
    if(mAxis === 59) {
      hAxis++;
      mAxis=0;
    }
    else {
      mAxis++;
    }

    if (Object.keys(activeUserData).length === 12) activeUserData.shift();

    redraw(
      activeUserData, id, categories, sca.axisOpt, sca.svgAttr, 8
    );
  }, 2000);

  $("#svg-active-users").on("remove", () => clearInterval(interval));

};
