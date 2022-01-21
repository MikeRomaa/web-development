const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Select a random item in the given array.
 * @param {any[]} array
 * @returns {any}
 */
const randomChoice = (array) => array[Math.floor(Math.random() * array.length)];

/**
 * Returns a random integer in the range [min, max]
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const randomNumber = (min, max) => Math.round(Math.random() * (max - min)) + min;

/**
 * Returns a random uppercase string of given length
 * @param {number} length
 * @returns {string}
 */
const randomString = (length) => Array(length).fill().reduce(out => out + randomChoice(chars.split('')), '');

/**
 * Returns a random license plate
 * @returns {string}
 */
const randomPlate = () => `${randomString(3)}-${randomNumber(1000, 10000)}`;

function minuteToTimeIndex(minute) {
    if (minute <= 5 * 60)
        return 0;  // 0:00 - 5:00
    else if (minute <= 9 * 60)
        return 1;  // 5:01 - 9:00
    else if (minute <= 14 * 60)
        return 2;  // 9:01 - 14:00
    else if (minute <= 16 * 60)
        return 3;  // 14:01 - 16:00
    else if (minute <= 18 * 60)
        return 4;  // 16:01 - 18:00
    else if (minute <= 20 * 60)
        return 5;  // 18:01 - 20:00
    else if (minute <= 23 * 60 + 59)
        return 6;  // 20:01 - 23:59
    else
        throw new Error('Invalid minute');
}

/**
 * Generates an array where the occurrence of each vehicle type's
 * occurrence is the percentage passed to the function.
 * @param {number} car 0 <= n <= 1
 * @param {number} truck 0 <= n <= 1
 * @param {number} motorcycle 0 <= n <= 1
 * @param {number} bus 0 <= n <= 1
 * @returns {string[]}
 */
const vehicleArray = (car, truck, motorcycle, bus) => Array(car * 100).fill('residential car').concat(
                                                      Array(truck * 100).fill('truck').concat(
                                                      Array(motorcycle * 100).fill('motorcycle').concat(
                                                      Array(bus * 100).fill('bus'))));

/**
 * Returns a random vehicle type based on the given minute
 * @param {number} minute 0 <= n <= 1439
 * @returns {string}
 */
function randomVehicleType(minute) {
    switch(minuteToTimeIndex(minute)) {
        case 0:
            return randomChoice(vehicleArray(.30, .65, .05, .00));
        case 1:
            return randomChoice(vehicleArray(.50, .25, .05, .20));
        case 2:
            return randomChoice(vehicleArray(.40, .40, .10, .10));
        case 3:
            return randomChoice(vehicleArray(.45, .30, .10, .15));
        case 4:
            return randomChoice(vehicleArray(.60, .15, .05, .20));
        case 5:
            return randomChoice(vehicleArray(.60, .25, .05, .10));
        case 6:
            return randomChoice(vehicleArray(.50, .40, .05, .05));
        default:
            throw new Error('Invalid minute');
    }
}

/**
 * Returns a random value of how many vehicles pass
 * through the toll booth at the given minute
 * @param {number} minute 0 <= n <= 1439
 * @returns {number}
 */
function randomVehicleRate(minute) {
    switch(minuteToTimeIndex(minute)) {
        case 0:
            return randomNumber(2, 10);
        case 1:
            return randomNumber(2, 40);
        case 2:
            return randomNumber(5, 20);
        case 3:
            return randomNumber(10, 30);
        case 4:
            return randomNumber(20, 40);
        case 5:
            return randomNumber(10, 30);
        case 6:
            return randomNumber(5, 15);
        default:
            throw new Error('Invalid minute');
    }
}
