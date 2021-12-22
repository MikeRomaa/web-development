const bestPlanSpan = document.getElementById('best-plan');
const worstPlanSpan = document.getElementById('worst-plan');
const table = document.getElementById('datatable');
const pageSizeSelect = document.getElementsByName('page-size')[0];
const currentPageSpan = document.getElementById('current-page');
const totalPageSpan = document.getElementById('total-pages');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');

let rawData;
let paginatedData;
let currentPage = 0;

fetch('data.json')
    .then((response) => response.json())
    .then((json) => {
        rawData = json;
        paginatedData = paginateData();
        populateTable();
        updateControls();

        const count = {
            'sucker': planCount(0),
            'basic': planCount(1),
            'comprehensive': planCount(2),
            'unlimited': planCount(3),
        };
        document.getElementById('num-sucker').textContent = count.sucker;
        document.getElementById('num-basic').textContent = count.basic;
        document.getElementById('num-comprehensive').textContent = count.comprehensive;
        document.getElementById('num-unlimited').textContent = count.unlimited;

        const profit = {
            'sucker': planProfit(0),
            'basic': planProfit(1),
            'comprehensive': planProfit(2),
            'unlimited': planProfit(3),
        };
        document.getElementById('profit-sucker').textContent = profit.sucker.toFixed(2);
        document.getElementById('profit-basic').textContent = profit.basic.toFixed(2);
        document.getElementById('profit-comprehensive').textContent = profit.comprehensive.toFixed(2);
        document.getElementById('profit-unlimited').textContent = profit.unlimited.toFixed(2);

        let bestPlan = 'sucker';
        if (profit.basic > profit[bestPlan]) bestPlan = 'basic';
        if (profit.comprehensive > profit[bestPlan]) bestPlan = 'comprehensive';
        if (profit.unlimited > profit[bestPlan]) bestPlan = 'unlimited';
        bestPlanSpan.classList.add(`badge-${bestPlan}`);
        bestPlanSpan.textContent = bestPlan.charAt(0).toUpperCase() + bestPlan.slice(1);

        document.getElementById('best-percentage').textContent = Math.round(count[bestPlan] / rawData.length * 100);

        let worstPlan = 'sucker';
        if (profit.basic < profit[worstPlan]) worstPlan = 'basic';
        if (profit.comprehensive < profit[worstPlan]) worstPlan = 'comprehensive';
        if (profit.unlimited < profit[worstPlan]) worstPlan = 'unlimited';
        worstPlanSpan.classList.add(`badge-${worstPlan}`);
        worstPlanSpan.textContent = worstPlan.charAt(0).toUpperCase() + worstPlan.slice(1);

        document.getElementById('worst-percentage').textContent = Math.round(count[worstPlan] / rawData.length * 100);

        const overpay = rawData.map((user) => calculateBill(user.plan, user.usage) - calculateBill(worstPlan, user.usage));
        document.getElementById('overpay').textContent = (overpay.reduce((a, b) => a + b, 0) / overpay.length).toFixed(2);
    });

function planCount(plan) {
    return rawData.reduce((count, val) => {
            if (val.plan == plan) return ++count;
            return count;
        }, 0);
}

function planProfit(plan) {
    return rawData.reduce((profit, val) => {
            profit += calculateBill(plan, val.usage)
            return profit;
        }, 0);
}

function updatePageSize() {
    paginatedData = paginateData();
    currentPage = 0;
    populateTable();
    updateControls();
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--
        populateTable();
        updateControls();
    }
}

function nextPage() {
    if (currentPage < paginatedData.length - 1) {
        currentPage++;
        populateTable();
        updateControls();
    }
}

function updateControls() {
    prevPageBtn.disabled = currentPage == 0;
    nextPageBtn.disabled = currentPage == paginatedData.length - 1;
    totalPageSpan.textContent = paginatedData.length;
    currentPageSpan.textContent = currentPage + 1;
}

function planToString(plan) {
    let str;
    switch(plan) {
        case 0: str = 'Sucker'; break;
        case 1: str = 'Basic'; break;
        case 2: str = 'Comprehensive'; break;
        case 3: str = 'Unlimited'; break;
        default: throw new Error('Unknown plan');
    }
    return `<span class="badge badge-${str.toLowerCase()}">${str}</span>`;
}

function calculateBill(plan, usage) {
    switch(plan) {
        case 'sucker':
        case 0: return 4.99 + usage * 0.02;
        case 'basic':
        case 1: return 19.99 + Math.max(usage - 1000, 0) * 0.10;
        case 'comprehensive':
        case 2: return 24.99 + Math.max(usage - 4000, 0) * 0.25;
        case 'unlimited':
        case 3: return 49.99;
        default: throw new Error('Unknown plan');
    }
}


function paginateData() {
    const pages = [];
    const pageSize = parseInt(pageSizeSelect.value);

    for (let i = 0; i < Math.ceil(rawData.length / pageSize); i++) {
        const start = i * pageSize;
        pages.push(rawData.slice(start, start + pageSize));
    }

    return pages;
}

function populateTable() {
    table.innerHTML = '';
    for (const user of paginatedData[currentPage]) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.phone}</td>
            <td>${planToString(user.plan)}</td>
            <td>${Math.round(user.usage / 100) / 10} MB</td>
            <td>$${calculateBill(user.plan, user.usage).toFixed(2)}</td>
        `;
        table.appendChild(row);
    }
}
