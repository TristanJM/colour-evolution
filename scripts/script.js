'use strict';

let totalRows = 60;		// integer
let totalCols = 100;	// integer
let genDelay = 50;		// ms
let generationInProgress = false;

// Click handler for Evolve button
function generatePattern() {
	$('html, body').animate({ 'scrollTop': window.innerHeight }, 600);
	
	if (!generationInProgress) {
		generationInProgress = true;
		initiateGeneration();	
	}
}

// Initiates the pattern generation
function initiateGeneration() {
	let container = document.getElementById('pattern-container');
	container.innerHTML = '';
		
	// Set number of generations
	let generations = parseInt(document.getElementById('sel-numGenerations').value);
	if (generations >= 1 && generations <= 1000) totalRows = generations;
		
	// Generate first row
	generateFirstRow(container);

	// Generate the children
	var startEvolutionDelay = (genDelay/2)*(totalCols/2) + genDelay*10;
	setTimeout(() => generateNewRow(2, container), startEvolutionDelay);
}

// Generate the first row of cells
function generateFirstRow(container) {
	let row = document.createElement('div');
	row.className = 'cell-row';
	row.id = 'row1';
	
	let colourType = document.getElementById('sel-colourPalette').value;
	
	// variables to calculate animation properties
	let middleCell = Math.ceil(totalCols/2);
	let oddCols = (totalCols % 2) !== 0;

	for (let i=1; i<=totalCols; i++) {
		let cell = document.createElement('div');
		cell.className = 'cell firstRow-cell';
		cell.id = 'row1-col' + i;
		
		cell.style.backgroundColor = randomColour(colourType); // Assign cell colour
		cell.style['animation-delay'] = animateFirstRow(i-1, middleCell, oddCols); // Assign cell animation-delay
		
		row.appendChild(cell);
	}	
	container.appendChild(row);
}

// Assigns the cell an appropriate animation-delay value to display as a 'middle out' animation
function animateFirstRow(colNum, middleCell, oddCols) {
	let evenOffset = oddCols ? 0 : -1;	// even cols in total means an extra middle cell, so requires extra increment
	
	if (colNum < middleCell) return ((totalCols - middleCell+evenOffset) - colNum)*genDelay/2 + 'ms';
	else return (middleCell - (totalCols - colNum))*genDelay/2 + 'ms';
}

// Return a random RGB colour
function randomColour(type) {
	// Type: mono (for black and white)
	if (type === 'mono') {
		let state = randNumber(1);
		if (state === 0) return 'rgb(255,255,255)';
		else return 'rgb(0,0,0)';
	}
	// Type: primary (for either R, G, B primary colours)
	else if (type === 'primary') {
		let state = randNumber(2);
		if (state === 0) return 'rgb(255,0,0)';
		else if (state === 1) return 'rgb(0,255,0)';
		else return 'rgb(0,0,255)';
	}
	// Type: all (completely random colour)
	else if (type === 'all') {
		return `rgb( ${randNumber(255)}, ${randNumber(255)}, ${randNumber(255)} )`;
	}
}

// Returns random number 0 <= x <= max
function randNumber(max) {
	return Math.floor(Math.random() * (max+1));
}

// Generate a new child row
function generateNewRow(rowNum, container) {
	let fragment = document.createDocumentFragment();
	
	let row = document.createElement('div');
	row.className = 'cell-row';
	row.id = 'row'+rowNum;
	
	// Create Row
	for (let i=1; i<=totalCols; i++) {
		let cell = document.createElement('div');
		cell.className = 'cell';
		
		// Get parent columns (with wrap)
		let parent1col = (i == 1) ? totalCols : i-1;
		let parent2col = i;
		let parent3col = (i == totalCols) ? 1 : i+1;
	
		let childRGB = [parent1col, parent2col, parent3col]
			.map(column => document.getElementById('row'+(rowNum-1)+'-col'+column))	// get parent elements
			.map(parent => getRGB(parent.style.backgroundColor))										// get parent background colours
			.reduce((accumulator, parentRGB) => {																		// reduce to average RGB of all parents
					return {
						R: accumulator.R + (parentRGB.R/3),
						G: accumulator.G + (parentRGB.G/3),
						B: accumulator.B + (parentRGB.B/3)
					}
				}, {R:0, G:0, B:0});
		
		// set child cell properties
		cell.style.backgroundColor = `rgb( ${Math.floor(childRGB.R)}, ${Math.floor(childRGB.G)}, ${Math.floor(childRGB.B)} )`;	
		cell.id = 'row' + rowNum + '-col' + i;
		
		fragment.appendChild(cell);
	}
	
	row.appendChild(fragment.cloneNode(true));
	container.appendChild(row);
	
	// Generate the next row after a delay
	if (rowNum < totalRows) setTimeout(() => generateNewRow(rowNum+1, container), genDelay);
	else generationInProgress = false;
}

// Get the RGB values of a cell
function getRGB(cssRgb) {
	// Get in form { R, G, B }
	cssRgb = cssRgb
		.substring(cssRgb.indexOf('(')+1, cssRgb.indexOf(')'))
		.split(', ')
		.map(x => parseInt(x));
	
	return { R : cssRgb[0], G : cssRgb[1], B : cssRgb[2] }
}

// Show/hide header after scrolling
window.addEventListener('scroll', (event) => {
	if (this.scrollY > (window.innerHeight*0.6)) document.getElementById('control-panel').style.transform = 'translateY(0)';
	else document.getElementById('control-panel').style.transform = 'translateY(-100%)';    
}, false);