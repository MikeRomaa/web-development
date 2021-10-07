let score = 0;
let clickedTile = null;
let preventClick = false;

const container = document.getElementById('tiles');

/**
 * @returns {HTMLDivElement} Image element of a blank tile
 */
const blankTile = () => {
    const blank = document.createElement('img');
    blank.src = './img/rune_blank.png';
    blank.className = 'blank';
    return blank;
}

/**
 * @returns {HTMLDivElement} Image element of a tile with the given number
 */
const runeTile = (number) => {
    const rune = document.createElement('img');
    rune.src = `./img/rune_${number}.png`;
    rune.className = 'rune';
    return rune;
}

/**
 * @param {number} Tile number, corresponds to the image file name
 * @returns {HTMLDivElement} Div element containing a blank and numbered tile
 *                           onclick event is bound to handleClick()
 */
const tile = (number) => {
    const div = document.createElement('div');
    div.className = 'tile';
    div.dataset.number = number;
    div.onclick = handleClick;
    div.appendChild(runeTile(number));
    div.appendChild(blankTile());
    return div;
}

const tiles = [];
for (let i = 1; i < 9; i++) {
    tiles.push(tile(i));
    tiles.push(tile(i));
}

/**
 * Sets score to 0, hides the win message, and shuffles the tiles
 */
function reset() {
    setScore(0);
    tiles.forEach(tile => tile.classList.remove('flipped'));
    container.replaceChildren(...shuffleArray(tiles));
    document.getElementById('win').classList.remove('show');
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

/**
 * Sets the score to the given value, and update the score display
 * @param {number} newScore Score to display
 */
 function setScore(newScore) {
    score = newScore;
    document.getElementById('score').innerText = newScore;
}

/**
 * Handles game logic for when a tile is clicked
 * @param {MouseEvent} event
 */
function handleClick(event) {
    const tile = event.currentTarget;

    // If the tile is already flipped or an animation is in progress, do nothing
    if (preventClick || tile.classList.contains('flipped')) {
        return;
    }

    setScore(score + 1);
    tile.classList.toggle('flipped');

    // If this is the second tile clicked, check if it matches the first
    if (clickedTile) {
        if (tile.dataset.number === clickedTile.dataset.number) {
            clickedTile = null;
            if (tiles.every(tile => tile.classList.contains('flipped'))) {
                document.getElementById('win').classList.add('show');
            }
        } else {
            // Set the animation to flip back over in 500ms, prevent further clicks until it is done
            preventClick = true;
            setTimeout(() => {
                tile.classList.toggle('flipped');
                clickedTile.classList.toggle('flipped');
                clickedTile = null;
                preventClick = false;
            }, 500);
        }
    } else {
        // If this is the first tile clicked
        clickedTile = tile;
    }
}
