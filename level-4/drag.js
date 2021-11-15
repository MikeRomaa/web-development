const board = document.getElementById('puzzle');

let element = undefined;
let startX = 0;
let startY = 0;
let dx = 0;
let dy = 0;

/**
 * Sets the initial drag location when mouse is clicked.
 * @param {MouseEvent} event
 */
function startDrag(event) {
    if (!event.target || event.target.localName !== 'canvas') return;

    element = event.target;
    startX = event.clientX;
    startY = event.clientY;
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
    
    const inXBounds = board.offsetLeft + board.clientWidth > event.clientX;
    const inYBounds = board.offsetTop + board.clientHeight > event.clientY;
    // Check if the image is on top of the board or not.
    if (inXBounds && inYBounds) {
        // TODO: Snap image to grid location.
    } else {
        // Reset position if it is out bounds
        element.style.transform = null;
    }
    element = undefined;
}

document.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', doDrag);
document.addEventListener('mouseup', endDrag);
