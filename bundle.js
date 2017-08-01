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

(0, _ticking_numbers.displayTickingNumbers)(); // const data = [30, 86,  168, 281, 303];
//
// d3.select(".barchart")
//   .selectAll("div")
//   .data(data)
//     .enter()
//     .append("div")
//     .style("width", d => `${d}px`)
//     .text(d => `$ ${d}`);

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
var monthlyDownloads = 50000;
document.getElementById('monthly-revenue').innerHTML = formatDollar(monthlyRevenue);
document.getElementById('monthly-downloads').innerHTML = formatNumber(monthlyDownloads);

var tick = function tick(initVal) {
  return initVal + Math.random() * (initVal / 1000);
};

var displayTickingNumbers = exports.displayTickingNumbers = function displayTickingNumbers() {
  setInterval(function () {
    monthlyRevenue = tick(monthlyRevenue, 'monthly-revenue');
    document.getElementById('monthly-revenue').innerHTML = formatDollar(monthlyRevenue);
    monthlyDownloads = tick(monthlyDownloads, 'monthly-downloads');
    document.getElementById('monthly-downloads').innerHTML = formatNumber(monthlyDownloads);
  }, 1500);
};

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map