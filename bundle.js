/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	var totalRows = 60; // integer
	var totalCols = 100; // integer
	var genDelay = 50; // ms
	var generationInProgress = false;
	
	var evolveButtons = document.querySelectorAll('.btn-evolve');
	for (var i = 0; i < evolveButtons.length; i++) {
		evolveButtons[i].addEventListener('click', generatePattern, false);
	} // Click handler for Evolve button
	function generatePattern() {
		$('html, body').animate({ 'scrollTop': window.innerHeight }, 600);
	
		if (!generationInProgress) {
			generationInProgress = true;
			initiateGeneration();
		}
	}
	
	// Initiates the pattern generation
	function initiateGeneration() {
		var container = document.getElementById('pattern-container');
		container.innerHTML = '';
	
		// Set number of generations
		var generations = parseInt(document.getElementById('sel-numGenerations').value);
		if (generations >= 1 && generations <= 1000) totalRows = generations;
	
		// Generate first row
		generateFirstRow(container);
	
		// Generate the children
		var startEvolutionDelay = genDelay / 2 * (totalCols / 2) + genDelay * 10;
		setTimeout(function () {
			return generateNewRow(2, container);
		}, startEvolutionDelay);
	}
	
	// Generate the first row of cells
	function generateFirstRow(container) {
		var row = document.createElement('div');
		row.className = 'cell-row';
		row.id = 'row1';
	
		var colourType = document.getElementById('sel-colourPalette').value;
	
		// variables to calculate animation properties
		var middleCell = Math.ceil(totalCols / 2);
		var oddCols = totalCols % 2 !== 0;
	
		for (var _i = 1; _i <= totalCols; _i++) {
			var cell = document.createElement('div');
			cell.className = 'cell firstRow-cell';
			cell.id = 'row1-col' + _i;
	
			cell.style.backgroundColor = randomColour(colourType); // Assign cell colour
			cell.style['animation-delay'] = animateFirstRow(_i - 1, middleCell, oddCols); // Assign cell animation-delay
	
			row.appendChild(cell);
		}
		container.appendChild(row);
	}
	
	// Assigns the cell an appropriate animation-delay value to display as a 'middle out' animation
	function animateFirstRow(colNum, middleCell, oddCols) {
		var evenOffset = oddCols ? 0 : -1; // even cols in total means an extra middle cell, so requires extra increment
	
		if (colNum < middleCell) return (totalCols - middleCell + evenOffset - colNum) * genDelay / 2 + 'ms';else return (middleCell - (totalCols - colNum)) * genDelay / 2 + 'ms';
	}
	
	// Return a random RGB colour
	function randomColour(type) {
		// Type: mono (for black and white)
		if (type === 'mono') {
			var state = randNumber(1);
			if (state === 0) return 'rgb(255,255,255)';else return 'rgb(0,0,0)';
		}
		// Type: primary (for either R, G, B primary colours)
		else if (type === 'primary') {
				var _state = randNumber(2);
				if (_state === 0) return 'rgb(255,0,0)';else if (_state === 1) return 'rgb(0,255,0)';else return 'rgb(0,0,255)';
			}
			// Type: all (completely random colour)
			else if (type === 'all') {
					return 'rgb( ' + randNumber(255) + ', ' + randNumber(255) + ', ' + randNumber(255) + ' )';
				}
	}
	
	// Returns random number 0 <= x <= max
	function randNumber(max) {
		return Math.floor(Math.random() * (max + 1));
	}
	
	// Generate a new child row
	function generateNewRow(rowNum, container) {
		var fragment = document.createDocumentFragment();
	
		var row = document.createElement('div');
		row.className = 'cell-row';
		row.id = 'row' + rowNum;
	
		// Create Row
		for (var _i2 = 1; _i2 <= totalCols; _i2++) {
			var cell = document.createElement('div');
			cell.className = 'cell';
	
			// Get parent columns (with wrap)
			var parent1col = _i2 == 1 ? totalCols : _i2 - 1;
			var parent2col = _i2;
			var parent3col = _i2 == totalCols ? 1 : _i2 + 1;
	
			var childRGB = [parent1col, parent2col, parent3col].map(function (column) {
				return document.getElementById('row' + (rowNum - 1) + '-col' + column);
			}) // get parent elements
			.map(function (parent) {
				return getRGB(parent.style.backgroundColor);
			}) // get parent background colours
			.reduce(function (accumulator, parentRGB) {
				// reduce to average RGB of all parents
				return {
					R: accumulator.R + parentRGB.R / 3,
					G: accumulator.G + parentRGB.G / 3,
					B: accumulator.B + parentRGB.B / 3
				};
			}, { R: 0, G: 0, B: 0 });
	
			// set child cell properties
			cell.style.backgroundColor = 'rgb( ' + Math.floor(childRGB.R) + ', ' + Math.floor(childRGB.G) + ', ' + Math.floor(childRGB.B) + ' )';
			cell.id = 'row' + rowNum + '-col' + _i2;
	
			fragment.appendChild(cell);
		}
	
		row.appendChild(fragment.cloneNode(true));
		container.appendChild(row);
	
		// Generate the next row after a delay
		if (rowNum < totalRows) setTimeout(function () {
			return generateNewRow(rowNum + 1, container);
		}, genDelay);else generationInProgress = false;
	}
	
	// Get the RGB values of a cell
	function getRGB(cssRgb) {
		// Get in form { R, G, B }
		cssRgb = cssRgb.substring(cssRgb.indexOf('(') + 1, cssRgb.indexOf(')')).split(', ').map(function (x) {
			return parseInt(x);
		});
	
		return { R: cssRgb[0], G: cssRgb[1], B: cssRgb[2] };
	}
	
	// Show/hide header after scrolling
	window.addEventListener('scroll', function (event) {
		if (window.scrollY > window.innerHeight * 0.6) document.getElementById('control-panel').style.transform = 'translateY(0)';else document.getElementById('control-panel').style.transform = 'translateY(-100%)';
	}, false);

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map