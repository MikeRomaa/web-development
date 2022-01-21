const timeHeading = document.getElementById('time');
const pausedHeading = document.getElementById('paused');
const rateSpan = document.getElementById('rate');
const table = document.getElementById('table');
const logDiv = document.getElementById('log');

function setSimInterval() {
    rateSpan.textContent = rate;
    clearInterval(simInterval);
    simInterval = setInterval(advanceClock, 1000 / rate);
}

function increaseSpeed() {
    rate = Math.min(rate * 2, 512);
    setSimInterval();
}

function decreaseSpeed() {
    rate = Math.max(rate / 2, 0.25);
    setSimInterval();
}

function toggleSimulation() {
    running = !running;
    pausedHeading.style.display = running ? 'none' : 'block';
}

function reset() {
    minute = 0;
    rate = 1;
    setSimInterval();
    timeHeader.textContent = '00:00';
    table.innerHTML = tableData.join('');
    logDiv.innerHTML = '';
}

// Each tick is a minute in the simulation
function advanceClock() {
    if (minute > 1439) { running = false }
    if (!running) return;

    for (let i = 0; i < randomVehicleRate(minute); i++) {
        const type = randomVehicleType(minute);
        const plate = randomPlate();

        const row = table.children[2 + 3 * minuteToTimeIndex(minute)].children[0].children;
        const [cars, trucks, motorcycles, busses, total, revenue] = row;

        let cost = 0;
        let discount = 1;
        let ezPass = false;
        let resident = false;

        if (type === 'residential car') {
            cars.textContent = parseInt(cars.textContent) + 1;
            ezPass = randomNumber(1, 10) <= 7;
            resident = ezPass && randomNumber(1, 10) <= 6;
            cost = 12;
        }
        if (type === 'truck') {
            trucks.textContent = parseInt(trucks.textContent) + 1;
            ezPass = randomNumber(1, 10) <= 9;
            resident = false;
            cost = 18;
        }
        if (type === 'motorcycle') {
            motorcycles.textContent = parseInt(motorcycles.textContent) + 1;
            ezPass = randomNumber(1, 10) <= 7;
            resident = ezPass && randomNumber(1, 10) <= 6;
            cost = 8;
        }
        if (type === 'bus') {
            busses.textContent = parseInt(busses.textContent) + 1;
            ezPass = true;
        }

        if (ezPass) { discount = 0.9 }
        if (resident) { discount = 0.6 }
        const paid = cost * discount;

        total.textContent = parseInt(total.textContent) + 1;
        revenue.textContent = `$${(parseFloat(revenue.textContent.slice(1)) + paid).toFixed(2)}`;

        const time = `${Math.floor(minute / 60).toString().padStart(2, '0')}:${(minute % 60).toString().padStart(2, '0')}`
        if (logDiv.children.length > 20) { logDiv.removeChild(logDiv.childNodes[0]) }
        logDiv.innerHTML += `<p>${time} - A ${type} (<code>${plate}</code>) ${ezPass ? 'with EZ-Pass' : ''} paid $${paid.toFixed(2)}</p>`;
    }

    minute++;
    timeHeading.textContent = `${Math.floor(minute / 60 % 24).toString().padStart(2, '0')}:${(minute % 60).toString().padStart(2, '0')}`
};
