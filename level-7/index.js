/*
    Creates the initial table to insert data into.
    Each row is just a duplicate so it doesn't make
    sense to put the raw HTML. Instead the HTML is
    generated and is just inserted into the DOM.
*/
const times = [
    '00:00 - 05:00',
    '05:01 - 09:00',
    '09:01 - 14:00',
    '14:01 - 16:00',
    '16:01 - 18:00',
    '18:01 - 20:00',
    '20:01 - 23:59',
];

const tableData = times.map((time, i) => `
    <thead class="table-dark text-center">
        <th colspan="6">${time}</th>
    </thead>
    <thead class="table-dark table-active text-center">
        <th style="width: 15%">Cars</th>
        <th style="width: 15%">Trucks</th>
        <th style="width: 15%">Motorcycles</th>
        <th style="width: 15%">Busses</th>
        <th style="width: 15%">Total</th>
        <th>Revenue</th>
    </thead>
    <tbody id="${i}">
        <tr class="text-center">
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>$0.00</td>
        </tr>
    </tbody>
`);

table.innerHTML = tableData.join('');

/* Initializes sim variables and starts the interval. */
let minute = 0;
let running = true;
let rate = 1;
let simInterval;
setSimInterval();