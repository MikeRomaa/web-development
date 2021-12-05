const guide = document.getElementById('guide');
const imageRetrieval = document.getElementById('inputURL');
const heightRetrieval = document.getElementById('heightPuzzlePieces');
const widthRetrieval = document.getElementById('widthPuzzlePieces');

let image;
let tiles = [];
let showGuide = false;

/**
 * Loads the image into a global variable.
 * @param {string} src Image URI
 */
function loadImage() {

    const img = new Image();
    // Run rest of program when the image loads.
    img.onload = () => {
        const height = parseInt(heightRetrieval.value);
        const width = parseInt(widthRetrieval.value);
        image = img;
        puzzleContainer.style = `width: ${img.width}px;
                        height: ${img.height}px;`
        guide.replaceChildren(image);
        splitImage(height, width);
        
        // Generate matrix of size width * height for storing puzzle state
        puzzle = Array(height).fill().map(()=>Array(width).fill());
    }
    img.src = imageRetrieval.value;
}

/**
 * Splits the image into rows * cols equally sized tiles.
 * The images will be inserted into the div#tiles.
 * @param {number} rows 
 * @param {number} cols 
 */
function splitImage(rows, cols) {
    const tileWidth = image.width / cols;
    const tileHeight = image.height / rows;

    tiles = [];

    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            tiles.push(imageTile(x, y, tileWidth, tileHeight));
        }
    }

    tileContainer.replaceChildren(...shuffleArray(tiles));
}

/**
 * Creates a canvas element with a width * height cutout of the image
 * at a given position.
 * @param {number} row 
 * @param {number} col 
 * @param {number} width 
 * @param {number} height 
 * @returns {HTMLCanvasElement}
 */
function imageTile(row, col, width, height) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;
    canvas.id = `${row},${col}`

    ctx.drawImage(image, width * col, height * row, width, height, 0, 0, width, height);

    return canvas;
}

function toggleGuide() {
    showGuide = !showGuide;
    guide.className = showGuide ? 'shown' : '';
}

/**
 * @param {any[]} array Array to be shuffled
 * @returns Shuffled array
 */
 function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function renderPuzzle() {
    for (let y = 0; y < puzzle.length; y++) {
        for (let x = 0; x < puzzle[y].length; x++) {
            const element = puzzle[y][x];
            if (element) {
                const newElement = puzzleContainer.appendChild(element);
                newElement.style.position = 'absolute';
                newElement.style.transform = `translate(${x * element.clientWidth}px,
                                                        ${y * element.clientHeight}px)`;
            }
        }
    }
}

function removeFromPuzzle(element) {
    for (let col = 0; col < puzzle.length; col++) {
        for (let row = 0; row < puzzle[col].length; row++) {
            if (puzzle[col][row] === element) {
                puzzle[col][row] = undefined;
            }
        }
    }
}
