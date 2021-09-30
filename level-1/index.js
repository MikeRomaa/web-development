// Initializing counters. These store the current values of any given coin
let pennies = 0;
let nickels = 0;
let dimes = 0;
let quarters = 0;
let halfDollars = 0;
let dollars = 0;

// Storing image divs in variables so we dont have to keep writing out getElementById()
const penniesImgDiv = document.getElementById("pennies-img");
const nickelsImgDiv = document.getElementById("nickels-img");
const dimesImgDiv = document.getElementById("dimes-img");
const quartersImgDiv = document.getElementById("quarters-img");
const halfDollarsImgDiv = document.getElementById("half-dollars-img");
const dollarsImgDiv = document.getElementById("dollars-img");

/**
 * Sets the content of the "total" span to the current monetary value
 * of the collection. Value will be rounded to the nearest cent.
 */
function updateTotal() {
    const total = pennies * 0.01 +
                nickels * 0.05 +
                dimes * 0.10 +
                quarters * 0.25 +
                halfDollars * 0.50 +
                dollars * 1.00;
    document.getElementById("total").textContent = total.toFixed(2);
}

/**
 * Creates an image element that is offset from its position by a random
 * amount (0-20 pixels on both axis). 
 * @param {*} src Source of image to be used
 * @returns Image element with random position offset
 */
function generateImage(src) {
    let newImg = document.createElement("img");
    newImg.src = src;
    newImg.height = 100;
    newImg.style = `left: ${50 + Math.floor(Math.random() * 20) * (Math.round(Math.random()) ? -1 : 1)}px;
                    top: ${20 + Math.floor(Math.random() * 20) * (Math.round(Math.random()) ? -1 : 1)}px`;
    return newImg;
}

/**
 * @param {*} container Image container element to insert or remove from
 * @param {*} count Amount to insert; negative values will remove images
 * @param {*} img Source of image to be used
 */
function addOrRemoveImages(container, count, img) {
    if (count > 0) {
        for (let i = 0; i < Math.abs(count); i++) {
            container.appendChild(generateImage(img));
        }
    } else {
        for (let i = 0; i < Math.abs(count); i++) {
            if (container.children.length) container.removeChild(container.lastChild);
        }
    }
}

function setPennies(num) {
    addOrRemoveImages(penniesImgDiv, num, "./img/penny.png");
    pennies = Math.max(0, pennies + num);
    document.getElementById("pennies").textContent = pennies;
    updateTotal();
}

function setNickels(num) {
    addOrRemoveImages(nickelsImgDiv, num, "./img/nickel.png");
    nickels = Math.max(0, nickels + num);
    document.getElementById("nickels").textContent = nickels;
    updateTotal();
}

function setDimes(num) {
    addOrRemoveImages(dimesImgDiv, num, "./img/dime.png");
    dimes = Math.max(0, dimes + num);
    document.getElementById("dimes").textContent = dimes;
    updateTotal();
}

function setQuarters(num) {
    addOrRemoveImages(quartersImgDiv, num, "./img/quarter.png");
    quarters = Math.max(0, quarters + num);
    document.getElementById("quarters").textContent = quarters;
    updateTotal();
}

function setHalfDollars(num) {
    addOrRemoveImages(halfDollarsImgDiv, num, "./img/half-dollar.png");
    halfDollars = Math.max(0, halfDollars + num);
    document.getElementById("half-dollars").textContent = halfDollars;
    updateTotal();
}

function setDollars(num) {
    addOrRemoveImages(dollarsImgDiv, num, "./img/dollar.png");
    dollars = Math.max(0, dollars + num);
    document.getElementById("dollars").textContent = dollars;
    updateTotal();
}

/**
 * @param  {...number} grades Any amount of numbers to calculate the average of
 * @returns Average of given numbers
 */
function average(...grades) {
    return grades.reduce((a, b) => a + b) / grades.length;
}

console.log(`Average of grades: ${average(85, 93, 91)}`);
