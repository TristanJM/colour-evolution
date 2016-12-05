'use strict';

let totalRows = 70;		// number
let totalCols = 100;	// number
let genDelay = 50;		// ms

// Generates first row of cells
function generatePattern() {
	let container = document.getElementById('pattern-container');

	let row = document.createElement('div');
	row.className = 'cell-row';
	row.id = 'row1';
	
	// Create Row 1
	for (let i=1; i<=totalCols; i++) {
		let cell = document.createElement('div');
		cell.className = 'cell';
		
		let colourType = document.getElementById('sel-colourPalette').value;
		cell.style.backgroundColor = randomColour(colourType);
		
		cell.id = 'row1-col' + i;
		
		row.appendChild(cell);
	}
	container.innerHTML = '';
	container.appendChild(row);
	
	// Generate the first row of children
	generateNewRow(2, container);	
}

// Return a random RGB colour
// type == mono (for black and white)
// type == primary (for either R, G, B primary colours)
// type == all (completely random colour)
function randomColour(type) {
	if (type === 'mono') {
		let state = Math.floor(Math.random() * 2);
		
		if (state === 0) return 'rgb(255,255,255)';
		else return 'rgb(0,0,0)';
	}
	else if (type === 'primary') {
		let state = Math.floor(Math.random() * 3) + 1;
		
		if (state === 1) return 'rgb(255,0,0)';
		else if (state === 2) return 'rgb(0,255,0)';
		else return 'rgb(0,0,255)';
	}
	else if (type === 'all') {
		let red = Math.floor(Math.random() * 256);
		let green = Math.floor(Math.random() * 256);
		let blue = Math.floor(Math.random() * 256);
		
		return `rgb( ${red}, ${green}, ${blue} )`;
	}
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
		
		// Get parents
		let parent1col = i-1;
		let parent2col = i;
		let parent3col = i+1;
		if (i == 1) parent1col = totalCols;
		if (i == totalCols) parent3col = 1;
		
		let parent1 = document.getElementById('row'+(rowNum-1)+'-col'+parent1col);
		let parent2 = document.getElementById('row'+(rowNum-1)+'-col'+parent2col);
		let parent3 = document.getElementById('row'+(rowNum-1)+'-col'+parent3col);
		
		// Get parents' background colours (RGB values)
		let parent1_RGB = getRGB(parent1.style.backgroundColor);
		let parent2_RGB = getRGB(parent2.style.backgroundColor);
		let parent3_RGB = getRGB(parent3.style.backgroundColor);
		
		// average out parent colours (three-way child)
		let child_R = Math.floor((parent1_RGB.R + parent2_RGB.R + parent3_RGB.R) / 3);
		let child_G = Math.floor((parent1_RGB.G + parent2_RGB.G + parent3_RGB.G) / 3);
		let child_B = Math.floor((parent1_RGB.B + parent2_RGB.B + parent3_RGB.B) / 3);

		// set child cell properties
		cell.style.backgroundColor = `rgb( ${child_R}, ${child_G}, ${child_B} )`;		
		cell.id = 'row' + rowNum + '-col' + i;
		
		fragment.appendChild(cell);
	}
	
	row.appendChild(fragment.cloneNode(true));
	container.appendChild(row);
	
	// Generate the next row after a delay
	if (rowNum < totalRows) setTimeout(() => generateNewRow(rowNum+1, container), genDelay);
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