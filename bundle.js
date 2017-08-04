/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ticking_numbers = __webpack_require__(1);

var _active_users = __webpack_require__(2);

var _channels = __webpack_require__(3);

var _geo = __webpack_require__(4);

var _reviews = __webpack_require__(5);

var _rating = __webpack_require__(6);

(0, _ticking_numbers.displayTickingNumbers)();
(0, _active_users.displayActiveUsers)();
(0, _channels.displayChannels)();
(0, _geo.displayGeoDist)();
(0, _reviews.displayReviews)();
(0, _rating.displayRating)();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var formatDollar = d3.format("$,.02f");
var formatNumber = d3.format(",.0f");

var monthlyRevenue = 1000000;
var monthlyDownloads = 60000;
document.getElementById('monthly-revenue').innerHTML = formatDollar(monthlyRevenue);
document.getElementById('monthly-downloads').innerHTML = formatNumber(monthlyDownloads);

var tick = function tick(initVal) {
  return initVal + Math.random() * (initVal / 1000);
};

var displayTickingNumbers = exports.displayTickingNumbers = function displayTickingNumbers() {
  var interval = setInterval(function () {
    monthlyRevenue = tick(monthlyRevenue, 'monthly-revenue');
    document.getElementById('monthly-revenue').innerHTML = formatDollar(monthlyRevenue);
    monthlyDownloads = tick(monthlyDownloads, 'monthly-downloads');
    document.getElementById('monthly-downloads').innerHTML = formatNumber(monthlyDownloads);
  }, 1500);

  $("monthly-revenue").on("remove", function () {
    return clearInterval(interval);
  });
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var generateActiveUserNumbers = function generateActiveUserNumbers(time) {
    var base = 50000;
    return {
        'time': time,
        'DAU': Math.floor(base * (1 + (Math.random() - 0.5) * 0.25)),
        'WAU': Math.floor(base * 2 * (1 + (Math.random() - 0.5) * 0.25)),
        'MAU': Math.floor(base * 5 * (1 + (Math.random() - 0.5) * 0.25))
    };
};

var generate = function generate(data, id, categories, axisNum) {

    // get data prepared
    var parseTime = d3.timeParse("%H:%M");
    var formatNumber = d3.format(".3s");

    // calculate chart size based on window size
    var margin = { top: 20, right: 20, bottom: 40, left: 30 };
    var width = $(id).width() - margin.left - margin.right;
    var height = $(id).height() - margin.top - margin.bottom;

    // map time str to time object
    var ddata = data.map(function (ele, i) {
        return {
            'time': parseTime(ele['time']),
            'DAU': ele['DAU'],
            'WAU': ele['WAU'],
            'MAU': ele['MAU']
        };
    });

    var selected = $(".active-user-select").find(":selected").text();
    var option = categories[selected];

    // set the range and scale the range to data
    var x = d3.scaleTime().range([0, width]).domain(d3.extent(ddata, function (d) {
        return d.time;
    }));
    // extent returns [min, max]
    var yRange = d3.extent(ddata, function (d) {
        return d[option];
    });
    var y = d3.scaleLinear().range([height, 0]).domain([yRange[1] / 2, yRange[1] * 1.2]);

    // defined axes
    var xAxis = d3.axisBottom(x).ticks(d3.timeMinute.every(Math.floor(data.length / axisNum))).tickSize(-height).tickPadding([6]);

    var yAxis = d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat(formatNumber);

    // define the plotting
    var area = d3.area().curve(d3.curveCardinal).x(function (d) {
        return x(d.time);
    }).y0(height).y1(function (d) {
        return y(d[option]);
    });

    // remove previous element
    d3.selectAll('.active-users').remove();

    // define svg
    var svg = d3.select(id).append("svg").attr("id", "svg-active-users").attr("width", width + margin.right + margin.left).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g").attr("class", "x axis").attr("id", "active-users-x-axis").attr("transform", "translate(0," + height + ")").call(xAxis);

    svg.append("g").attr("class", "y axis").call(yAxis);

    var path = svg.append("svg:path").datum(ddata).attr("class", "areaM").attr("d", area);

    var points = svg.selectAll(".gPoints").data(ddata).enter().append("g").attr("class", "gPoints");

    //legend rendering
    var legendSize = 8;
    var legendColor = 'rgba(0, 160, 233, 0.7)';

    var legend = svg.append('g').attr('class', 'legend').attr('transform', 'translate(0,' + (height + margin.bottom - legendSize) + ')');

    legend.append('rect').attr('width', legendSize).attr('height', legendSize).attr('transform', 'translate(0, -5)').style('fill', legendColor);

    legend.append('text').data(ddata).attr('x', legendSize * 1.2).attr('y', legendSize / 2).text(selected);

    points.selectAll(".usertipPoints").data(ddata).enter().append("circle").attr("class", "usertipPoints").attr("cx", function (d) {
        return x(d.time);
    }).attr("cy", function (d) {
        return y(d[option]);
    }).attr("r", "6px").on("mouseover", function (d) {
        // d3.select(this).transition().duration(100).style("opacity", 1);
        svg.append("g").attr("class", "tipDot").append("line").attr("class", "tipDot").transition().duration(50).attr("x1", x(d['time'])).attr("x2", x(d['time'])).attr("y2", height);

        svg.append("polyline") // attach a polyline
        .attr("class", "tipDot") // colour the line
        .style("fill", "black") // remove any fill colour
        .attr("points", x(d['time']) - 3.5 + "," + (y(1) - 2.5) + "," + x(d['time']) + "," + (y(1) + 6) + "," + (x(d['time']) + 3.5) + "," + (y(1) - 2.5));

        svg.append("polyline") // attach a polyline
        .attr("class", "tipDot") // colour the line
        .style("fill", "black") // remove any fill colour
        .attr("points", x(d['time']) - 3.5 + "," + (y(0) + 2.5) + "," + x(d['time']) + "," + (y(0) - 6) + "," + (x(d['time']) + 3.5) + "," + (y(0) + 2.5));

        $(this).tooltip({
            'container': 'body',
            'placement': 'left',
            'title': selected + ": " + formatNumber(d[option]),
            'trigger': 'hover'
        }).tooltip('show');
    }).on("mouseout", function (d) {
        // d3.select(this).transition().duration(100).style("opacity", 0);
        d3.selectAll('.tipDot').transition().duration(100).remove();
        $(this).tooltip('destroy');
    });

    $(".active-user-select").change(function (sel) {
        // remove old chart and re-generate
        d3.selectAll("#svg-active-users").remove();
        generate(data, id, categories, axisNum);
    });

    var axisOpt = { x: x, y: y, xAxis: xAxis, width: width, height: height };
    var svgAttr = { svg: svg, points: points, area: area, path: path };

    return { axisOpt: axisOpt, svgAttr: svgAttr };
};

var redraw = function redraw(data, id, categories, x, y, xAxis, svg, area, path, points, height, axisNum) {
    //format of time data
    var parseTime = d3.timeParse("%H:%M");
    var formatNumber = d3.format(".0%");

    var ddata = data.map(function (ele, i) {
        return {
            'time': parseTime(ele['time']),
            'DAU': ele['DAU'],
            'WAU': ele['WAU'],
            'MAU': ele['MAU']
        };
    });

    var selected = $(".active-user-select").find(":selected").text();
    var option = categories[selected];

    x.domain(d3.extent(ddata, function (d) {
        return d.time;
    }));

    xAxis.ticks(d3.timeMinute.every(Math.floor(data.length / axisNum)));

    svg.select("#active-users-x-axis").transition().duration(200).ease(d3.easeSin).call(xAxis);

    //area line updating
    path.datum(ddata).transition().duration(200).attr("class", "areaM").attr("d", area);

    //circle updating
    points.selectAll(".usertipPoints").data(ddata).attr("class", "usertipPoints").attr("cx", function (d) {
        return x(d.time);
    }).attr("cy", function (d) {
        return y(d[option]);
    }).attr("r", "6px");

    //draw new dot
    points.selectAll(".usertipPoints").data(ddata).enter().append("circle").attr("class", "usertipPoints").attr("cx", function (d) {
        return x(d.time);
    }).attr("cy", function (d) {
        return y(d[option]);
    }).attr("r", "6px");

    //remove old dot
    points.selectAll(".usertipPoints").data(ddata).exit().transition().duration(200).remove();
    // debugger;
};

//dynamic data and chart update
var displayActiveUsers = exports.displayActiveUsers = function displayActiveUsers() {
    var minutes = ['10:01', '10:02', '10:03', '10:04', '10:05', '10:06', '10:07', '10:08', '10:09'];

    var activeUserData = minutes.map(function (m) {
        return generateActiveUserNumbers(m);
    });

    var categories = {
        'Daily Active Users': "DAU",
        'Weekly Active Users': "WAU",
        'Monthly Active Users': "MAU"
    };

    var hAxis = 10;
    var mAxis = 10;

    var id = "#active-users";

    var sca = new generate(activeUserData, id, categories, 8);

    var interval = setInterval(function () {
        //update input data
        activeUserData.push(generateActiveUserNumbers(hAxis + ":" + mAxis));

        if (mAxis === 59) {
            hAxis++;
            mAxis = 0;
        } else {
            mAxis++;
        }

        if (Object.keys(activeUserData).length === 16) activeUserData.shift();

        redraw(activeUserData, id, categories, sca.axisOpt['x'], sca.axisOpt['y'], sca.axisOpt['xAxis'], sca.svgAttr['svg'], sca.svgAttr['area'], sca.svgAttr['path'], sca.svgAttr['points'], sca.axisOpt['height'], 8);
    }, 4000);

    $("#svg-active-users").on("remove", function () {
        return clearInterval(interval);
    });
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var channelData = [{ channel: 'Organic', platform: { iOS: 10500, Android: 15100, Desktop: 2300 } }, { channel: 'Google', platform: { iOS: 7900, Android: 6700, Desktop: 3100 } }, { channel: 'FB', platform: { iOS: 5700, Android: 6200, Desktop: 1100 } }, { channel: 'AdMob', platform: { iOS: 1400, Android: 4100, Desktop: 580 } }, { channel: 'Email', platform: { iOS: 450, Android: 810, Desktop: 1250 } }, { channel: 'Referral', platform: { iOS: 2500, Android: 700, Desktop: 240 } }];

var createView = function createView(id, data) {
  // geometry
  var margin = { top: 60, right: 0, bottom: 30, left: 0 };
  var width = $(id).width() - margin.right - margin.left;
  var height = $(id).height() - margin.top - margin.bottom;
  var dimension = {
    pieChart: {
      width: height,
      height: height
    },
    histogram: {
      width: 300,
      height: height
    }
  };
  var pieDim = dimension.pieChart;
  pieDim.radius = Math.min(pieDim.width, pieDim.height) / 2;
  // aesthetic
  var colors = { bar: 'grey', iOS: "#e08214", Android: "#14e082",
    Desktop: "#8214e0" };
  // calculate subtotals
  data.forEach(function (d) {
    d.total = d.platform.iOS + d.platform.Android + d.platform.Desktop;
  });

  // function to generate pie chart
  var createPieChart = function createPieChart(pData) {
    var pC = {};
    var svg = d3.select('#channels-left').append("svg").attr("width", pieDim.width).attr("height", pieDim.height).append("g").attr("transform", "translate(" + pieDim.width / 2 + "," + pieDim.height / 2 + ")");

    var arc = d3.arc().outerRadius(pieDim.radius - 10).innerRadius(0);
    var pie = d3.pie().sort(null).value(function (d) {
      return d.platform;
    });

    svg.selectAll("path").data(pie(pData)).enter().append("path").attr("d", arc).each(function (d) {
      this._current = d;
    }).style("fill", function (d) {
      return colors[d.data.type];
    }).on("mouseover", mouseover).on("mouseout", mouseout);

    pC.update = function (nD) {
      svg.selectAll("path").data(pie(nD)).transition().duration(500).attrTween("d", arcTween);
    };

    function mouseover(d) {
      // call the update function of histogram with new data.
      var nD = data.map(function (c) {
        return [c.channel, c.platform[d.data.type]];
      });
      histogram.update(nD, colors[d.data.type]);
    }
    //Utility function to be called on mouseout a pie slice.
    function mouseout(d) {
      // call the update function of histogram with all data.
      histogram.update(data.map(function (c) {
        return [c.channel, c.total];
      }), colors.bar);
    }

    function arcTween(a) {
      var i = d3.interpolateObject(this._current, a);
      this._current = i(0);
      return function (t) {
        return arc(i(t));
      };
    }

    return pC;
  };

  // function to generate histogram
  var createHistogram = function createHistogram(byChannelData) {
    var hG = {};
    var histDim = dimension.histogram;

    var svg = d3.select('#channels-right').append("svg").attr("width", histDim.width + margin.left + margin.right).attr("height", histDim.height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + (margin.top + 12) + ")");

    var x = d3.scaleBand().rangeRound([0, histDim.width]).padding(0.1).domain(byChannelData.map(function (d) {
      return d[0];
    }));

    var y = d3.scaleLinear().range([histDim.height, 0]).domain([0, d3.max(byChannelData, function (d) {
      return d[1];
    })]);

    var xAxis = d3.axisBottom(x);

    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + histDim.height + ")").call(xAxis);

    var bars = svg.selectAll(".bar").data(byChannelData).enter().append("g").attr("class", "bar");

    bars.append("rect").attr("x", function (d) {
      return x(d[0]);
    }).attr("y", function (d) {
      return y(d[1]);
    }).attr("width", x.bandwidth()).attr("height", function (d) {
      return histDim.height - y(d[1]);
    }).attr('fill', colors.bar).on("mouseover", mouseover).on("mouseout", mouseout);

    function mouseover(d) {
      var singleChannelData = data.filter(function (s) {
        return s.channel === d[0];
      })[0];
      var nD = d3.keys(singleChannelData.platform).map(function (s) {
        return { type: s, platform: singleChannelData.platform[s] };
      });
      // call update functions of pie-chart and legend.
      pieChart.update(nD);
      legend.update(nD);
    };

    function mouseout(d) {
      // reset the pie-chart and legend.
      pieChart.update(totalByPlatform);
      legend.update(totalByPlatform);
    };

    bars.append("text").text(function (d) {
      return d3.format(",")(d[1]);
    }).attr("x", function (d) {
      return x(d[0]) + x.bandwidth() / 2;
    }).attr("y", function (d) {
      return y(d[1]) - 5;
    }).attr("text-anchor", "middle");

    hG.update = function (nD, color) {
      // update the domain of the y-axis map to reflect change in frequencies.
      y.domain([0, d3.max(nD, function (d) {
        return d[1];
      })]);

      // Attach the new data to the bars.
      var newBars = svg.selectAll(".bar").data(nD);

      // transition the height and color of rectangles.
      newBars.select("rect").transition().duration(500).attr("y", function (d) {
        return y(d[1]);
      }).attr("height", function (d) {
        return histDim.height - y(d[1]);
      }).attr("fill", color);

      // transition the frequency labels location and change value.
      newBars.select("text").transition().duration(500).text(function (d) {
        return d3.format(",")(d[1]);
      }).attr("y", function (d) {
        return y(d[1]) - 5;
      });
    };

    return hG;
  };

  var createLegend = function createLegend(lData) {
    var leg = {};
    // compute percentage
    var getLegend = function getLegend(d, aD) {
      // console.log(d.platform / d3.sum(aD.map(c => c.platform)));
      return d3.format(".2%")(d.platform / d3.sum(aD.map(function (c) {
        return c.platform;
      })));
    };

    // create table for legend.
    var legend = d3.select('#channels-left').append("table").attr('class', 'legend');

    // create one row per segment.
    var tr = legend.append("tbody").selectAll("tr").data(lData).enter().append("tr");

    // create the first column for each segment.
    tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect").attr("width", '16').attr("height", '16').attr("fill", function (d) {
      return colors[d.type];
    }).attr('transform', 'translate(0, 6)');

    // create the second column for each segment.
    tr.append("td").text(function (d) {
      return d.type;
    });

    // create the third column for each segment.
    tr.append("td").attr("class", 'legend-platform').text(function (d) {
      return d3.format(",")(d.platform);
    });

    // create the fourth column for each segment.
    tr.append("td").attr("class", 'legend-perc').text(function (d) {
      return getLegend(d, lData);
    });

    // Utility function to be used to update the legend.
    leg.update = function (nD) {
      // update the data attached to the row elements.
      var rows = legend.select("tbody").selectAll("tr").data(nD);

      // update the frequencies.
      rows.select(".legend-platform").text(function (d) {
        return d3.format(",")(d.platform);
      });

      // update the percentage column.
      rows.select(".legend-perc").text(function (d) {
        return getLegend(d, nD);
      });
    };

    return leg;
  };

  var totalByPlatform = ["iOS", "Android", "Desktop"].map(function (p) {
    return { type: p, platform: d3.sum(data.map(function (t) {
        return t.platform[p];
      })) };
  });

  var totalByChannel = data.map(function (d) {
    return [d.channel, d.total];
  });

  var legend = createLegend(totalByPlatform);
  var pieChart = createPieChart(totalByPlatform);
  var histogram = createHistogram(totalByChannel);
};

var displayChannels = exports.displayChannels = function displayChannels() {
  createView("#channels", channelData);
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var usersByState = [{ state: 'CA', total: 962000, paid: 192400 }, { state: 'NY', total: 827400, paid: 251700 }, { state: 'TX', total: 535000, paid: 230400 }, { state: 'PA', total: 327600, paid: 126700 }, { state: 'MA', total: 210000, paid: 153400 }];

var createHBars = function createHBars(id, data) {
  data.sort(function (a, b) {
    return a.total - b.total;
  });

  var margin = { top: 20, right: 20, bottom: 30, left: 40 };
  var width = $(id).width() - margin.left - margin.right;
  var height = $(id).height() - margin.top - margin.bottom;

  var x = d3.scaleLinear().range([0, width]).domain([0, d3.max(data, function (d) {
    return d.total;
  })]);
  var y = d3.scaleBand().range([height, 0]).domain(data.map(function (d) {
    return d.state;
  })).padding(0.2);

  var xAxis = d3.axisBottom(x).ticks(5).tickFormat(function (d) {
    return parseInt(d / 1000);
  }).tickSizeInner([-height]);

  var yAxis = d3.axisLeft(y);

  var tooltip = d3.select("body").append("div").attr("class", "toolTip");

  var svg = d3.select(id).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g").attr('class', "x axis").attr('transform', "translate(0," + height + ")").call(xAxis);

  svg.append("g").attr('class', 'y axis').call(yAxis);

  svg.selectAll('.bar').data(data).enter().append('rect').attr('class', 'bar').attr('x', 0).attr("y", function (d) {
    return y(d.state);
  }).attr("width", function (d) {
    return x(d.total);
  }).attr("height", y.bandwidth()).on("mousemove", function (d) {
    var total = d3.format(',')(d.total);
    tooltip.style("left", d3.event.pageX - 50 + "px").style("top", d3.event.pageY - 70 + "px").style("display", "inline-block").html('Number of users in ' + d.state + ': ' + total);
  }).on("mouseout", function () {
    return tooltip.style("display", "none");
  });
};

var displayGeoDist = exports.displayGeoDist = function displayGeoDist() {
  createHBars("#geo", usersByState);
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var sampleReviews = [{ user: 'Andrew M.', body: "The text <b class='attention-high'>broke</b> out of the box, is it because I use bigger <b class='attention-low'>font</b> size?" }, { user: 'Elliot H.', body: "The <b class='attention-medium'>hamburger menu</b> does not respond to me, can't change my name!!" }, { user: 'Jules C.', body: "The app <b class='attention-high'>crashed</b> after I clicked the <b class='attention-low'>sumbit</b> button, what happened?" }, { user: 'Munyo F.', body: "I like it but it's kinda <b class='attention-medium'>slow</b> when I don't have WIFI." }, { user: 'Aaron W.', body: "The <b class='attention-low'>start</b> button should be on the bottom of the screen." }, { user: 'Chuck N.', body: "The animation is fancy, but I don't want to <b class='attention-medium'>wait</b> for it :P" }, { user: 'Louis C.', body: "There seems to be a <b class='attention-medium'>hiccup</b> when I was tapping on the <b class='attention-low'>carousel</b>." }];

var createReviews = function createReviews(reviews) {
  $(document).ready(function () {
    for (var i = 0; i < 5; i++) {
      var pEle = '<p id="review-' + i + '"></p><hr>';
      $("#reviews-container").append(pEle);
    }
    updateReviews(sampleReviews);
  });
};

var updateReviews = function updateReviews(reviews) {
  reviews.push(reviews.shift());
  for (var i = 0; i < 5; i++) {
    var content = reviews[i].user + ': "' + reviews[i].body + '"';
    document.getElementById('review-' + i).innerHTML = content;
  }
};

var displayReviews = exports.displayReviews = function displayReviews() {
  createReviews(sampleReviews);
  var interval = setInterval(function () {
    return updateReviews(sampleReviews);
  }, 4000);
  $("#reviews-container").on("remove", function () {
    return clearInterval(interval);
  });
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var generateData = function generateData(period) {
  var ratings = { day: 0.18, week: 0.13, month: 0.15 };
  var newarcsdata = [0.2, 0.2, 0.2, 0.2, 0.2];
  var newneedledata = [ratings[period]];
  return [newneedledata, newarcsdata];
};

var CreateGauge = function CreateGauge(id) {
  // geometry
  var margin = { top: 20, right: 10, bottom: 25, left: 10 };
  var width = $(id).width();
  var height = $(id).height();
  var r = width / 2;
  // aesthetic
  var colors = ["#91cf60", "#d9ef8b", "#fee08b", "#fc8d59", "#d73027"].reverse();
  var angleScale = d3.scaleLinear().domain([0, 5]).range([-90, 90]);

  var svg = d3.select(id).append("svg").attr("width", width).attr("height", height);

  var arc = d3.arc().innerRadius(r * 4.5 / 8).outerRadius(r * 0.9);
  // const outerArc = d3.arc().innerRadius(r * 5.5 / 8).outerRadius(r * 1.1);
  var pie = d3.pie().startAngle(-Math.PI / 2).endAngle(Math.PI / 2).sort(null).value(function (d) {
    return d;
  });

  var data = generateData('day');
  var arcs = svg.selectAll('g.slice').data(pie(data[1])).enter().append("svg:g").attr('class', 'slice');

  arcs.append('svg:path').attr("d", arc).attr("width", width).attr("height", height).attr("transform", "translate(" + (r - margin.left) + "," + (height - margin.bottom) + ")").style("fill", function (d, i) {
    return colors[i];
  });

  var labels = ['0+', '1+', '2+', '3+', '4+'];
  arcs.append("svg:text").attr("text-anchor", "middle").attr("transform", function (d) {
    var x = arc.centroid(d)[0] + r - margin.left;
    var y = arc.centroid(d)[1] + height - margin.bottom;
    return "translate(" + [x, y] + ")";
  }).style("fill", "black").text(function (d, i) {
    return labels[i];
  });

  var needle = svg.selectAll(".needle").data(data[0]).enter().append('path').classed('needle', true).attr('d', ['M0 -1', 'L0.03 0', 'A 0.03 0.03 0 0 1 -0.03 0', 'Z'].join(' ')).attr("transform", function (d) {
    r = 180 * d / data[1][3] - 90;
    return "translate(" + width / 2 + "," + (height - margin.bottom) + ") " + "rotate(" + r + ") " + "scale(" + width * 0.85 / 2 + ")";
  });

  handleClick('button-day');
  handleClick('button-week');
  handleClick('button-month');

  function handleClick(buttonId) {
    var period = buttonId.split("-")[1];
    d3.select("#" + buttonId).on("click", function () {
      data = generateData(period);
      arcs.data(pie(data[1])).transition().attr("d", arc);
      needle.data(data[0]).transition().ease(d3.easeElasticOut).duration(2000).attr("transform", function (d) {
        r = 180 * d / data[1][3] - 90;
        return "translate(" + width / 2 + "," + (height - margin.bottom) + ") " + "rotate(" + r + ")" + "scale(" + width * 0.85 / 2 + ")";
      });
    });
  }
};

var displayRating = exports.displayRating = function displayRating() {
  CreateGauge("#rating");
};

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map