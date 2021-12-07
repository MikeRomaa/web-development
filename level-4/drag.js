const puzzleContainer = document.getElementById('puzzle');
const tileContainer = document.getElementById('tiles');

let element = undefined;
let startX = 0;
let startY = 0;
let dx = 0;
let dy = 0;

let puzzle = [];

/**
 * Sets the initial drag location when mouse is clicked.
 * @param {MouseEvent} event
 */
function startDrag(event) {
    if (!event.target || event.target.localName !== 'canvas') return;

    element = event.target;

    const position = calculatePosition(element);
    startX = event.clientX - position.x + element.offsetLeft;
    startY = event.clientY - position.y + element.offsetTop;
}

/**
 * Translates the target image (element) to the mouse position.
 * @param {MouseEvent} event
 */
function doDrag(event) {
    if (element === undefined) return;

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    element.style.transform = `translate(${dx}px, ${dy}px)`;
}

/**
 * Places image down onto puzzle board.
 * @param {MouseEvent} event 
 */
function endDrag(event) {
    if (element === undefined) return;

    const position = calculatePosition(element);

    const x = Math.round(position.x / element.clientWidth);
    const y = Math.round(position.y / element.clientHeight);

    // Check if the image is on top of the board or not.
    if (x < puzzle[0].length && y < puzzle.length) {
        if (!puzzle[y][x]) {
            removeFromPuzzle(element);
            puzzle[y][x] = element;
            incrementScore();
        } else {
            element.style.position = null;
            element.style.transform = null;
        }
    } else {
        if (puzzleContainer.contains(element)) {
            removeFromPuzzle(element);
            element = tileContainer.appendChild(element);
        }
        element.style.position = null;
        element.style.transform = null;
    }
    element = undefined;
    renderPuzzle();
    checkPuzzle();
}

document.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', doDrag);
document.addEventListener('mouseup', endDrag);

/**
 * Returns the x and y coordinates of an element relative to it's parent element.
 * @param {Element}
 * @return {{x: number, y: number}} coordinates
 */
function calculatePosition(element) {
    const matches = element.style.transform.match(/[-]?[\d]+/g) ?? [];
    const transform = {
        x: parseFloat(matches[0] ?? 0),
        y: parseFloat(matches[1] ?? 0),
    };
    return {
        x: element.offsetLeft + transform.x,
        y: element.offsetTop + transform.y,
    }
}
