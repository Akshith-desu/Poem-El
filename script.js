// Global variables
let currentResults = null;
let comparisonData = null;
let monteCarloResults = null;

// Original functions
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function updateElasticity() {
    const value = parseFloat(document.getElementById('elasticity').value);
    document.getElementById('elasticityValue').textContent = value.toFixed(1);
    
    const absValue = Math.abs(value);
    let type = '';
    if (absValue < 1) {
        type = 'Inelastic (demand relatively unresponsive)';
    } else if (absValue === 1) {
        type = 'Unit Elastic (proportional response)';
    } else {
        type = 'Elastic (demand highly responsive)';
    }
    document.getElementById('elasticityType').textContent = type;
    
    calculate();
}

function togglePriceRange() {
    const strategy = document.getElementById('strategy').value;
    const priceRangeInputs = document.getElementById('priceRangeInputs');
    priceRangeInputs.style.display = strategy === 'dynamic' ? 'block' : 'none';
    calculate();
}

function calculateDemand(price, basePrice, baseDemand, elasticity) {
    return baseDemand * Math.pow(price / basePrice, elasticity);
}

function calculate() {
    const basePrice = parseFloat(document.getElementById('basePrice').value);
    const baseDemand = parseFloat(document.getElementById('baseDemand').value);
    const elasticity = parseFloat(document.getElementById('elasticity').value);
    const unitCost = parseFloat(document.getElementById('unitCost').value);
    const strategy = document.getElementById('strategy').value;
    const priceMin = parseFloat(document.getElementById('priceMin').value);
    const priceMax = parseFloat(document.getElementById('priceMax').value);

    if (strategy === 'fixed') {
        const demand = calculateDemand(basePrice, basePrice, baseDemand, elasticity);
        const revenue = basePrice * demand;
        const profit = revenue - (unitCost * demand);

        document.getElementById('fixedResults').style.display = 'block';
        document.getElementById('dynamicResults').style.display = 'none';

        document.getElementById('fixedPrice').textContent = '₹' + basePrice.toFixed(2);
        document.getElementById('fixedDemand').textContent = demand.toFixed(0);
        document.getElementById('fixedRevenue').textContent = '₹' + revenue.toFixed(2);
        document.getElementById('fixedProfit').textContent = '₹' + profit.toFixed(2);

        currentResults = { type: 'fixed', price: basePrice, demand, revenue, profit };
    } else {
        const pricePoints = [];
        let maxRevenue = -Infinity;
        let maxProfit = -Infinity;
        let optimalRevenuePrice = 0;
        let optimalProfitPrice = 0;

        for (let p = priceMin; p <= priceMax; p += 1) {
            const demand = calculateDemand(p, basePrice, baseDemand, elasticity);
            const revenue = p * demand;
            const profit = revenue - (unitCost * demand);

            pricePoints.push({
                price: p,
                demand: demand,
                revenue: revenue,
                profit: profit
            });

            if (revenue > maxRevenue) {
                maxRevenue = revenue;
                optimalRevenuePrice = p;
            }

            if (profit > maxProfit) {
                maxProfit = profit;
                optimalProfitPrice = p;
            }
        }

        const fixedDemand = calculateDemand(basePrice, basePrice, baseDemand, elasticity);
        const fixedRevenue = basePrice * fixedDemand;
        const fixedProfit = fixedRevenue - (unitCost * fixedDemand);

        const revenueImprovement = ((maxRevenue - fixedRevenue) / fixedRevenue) * 100;
        const profitImprovement = ((maxProfit - fixedProfit) / fixedProfit) * 100;

        document.getElementById('fixedResults').style.display = 'none';
        document.getElementById('dynamicResults').style.display = 'block';

        document.getElementById('revenueOptimalPrice').textContent = '₹' + optimalRevenuePrice.toFixed(2);
        document.getElementById('maxRevenue').textContent = '₹' + maxRevenue.toFixed(2);
        document.getElementById('revenueImprovement').textContent = (revenueImprovement > 0 ? '+' : '') + revenueImprovement.toFixed(2) + '%';
        document.getElementById('revenueImprovement').className = revenueImprovement > 0 ? 'positive' : 'negative';

        document.getElementById('profitOptimalPrice').textContent = '₹' + optimalProfitPrice.toFixed(2);
        document.getElementById('maxProfit').textContent = '₹' + maxProfit.toFixed(2);
        document.getElementById('profitImprovement').textContent = (profitImprovement > 0 ? '+' : '') + profitImprovement.toFixed(2) + '%';
        document.getElementById('profitImprovement').className = profitImprovement > 0 ? 'positive' : 'negative';

        currentResults = {
            type: 'dynamic',
            pricePoints,
            optimalRevenuePrice,
            maxRevenue,
            optimalProfitPrice,
            maxProfit,
            revenueImprovement,
            profitImprovement
        };

        plotCharts(pricePoints);
    }
}

function plotCharts(pricePoints) {
    const demandTrace = {
        x: pricePoints.map(p => p.price),
        y: pricePoints.map(p => p.demand),
        type: 'scatter',
        mode: 'lines',
        name: 'Demand',
        line: { color: '#007bff', width: 2 }
    };

    Plotly.newPlot('demandChart', [demandTrace], {
        xaxis: { title: 'Price (₹)' },
        yaxis: { title: 'Demand (units)' },
        margin: { t: 20, r: 20, b: 50, l: 60 }
    });

    const revenueTrace = {
        x: pricePoints.map(p => p.price),
        y: pricePoints.map(p => p.revenue),
        type: 'scatter',
        mode: 'lines',
        name: 'Revenue',
        line: { color: '#007bff', width: 2 }
    };

    const profitTrace = {
        x: pricePoints.map(p => p.price),
        y: pricePoints.map(p => p.profit),
        type: 'scatter',
        mode: 'lines',
        name: 'Profit',
        line: { color: '#28a745', width: 2 }
    };

    Plotly.newPlot('revenueProfitChart', [revenueTrace, profitTrace], {
        xaxis: { title: 'Price (₹)' },
        yaxis: { title: 'Amount (₹)' },
        margin: { t: 20, r: 20, b: 50, l: 60 }
    });
}

function runComparison() {
    const basePrice = parseFloat(document.getElementById('basePrice').value);
    const baseDemand = parseFloat(document.getElementById('baseDemand').value);
    const unitCost = parseFloat(document.getElementById('unitCost').value);
    const priceMin = parseFloat(document.getElementById('priceMin').value);
    const priceMax = parseFloat(document.getElementById('priceMax').value);

    const elasticityValues = [-0.5, -1.0, -1.5, -2.0, -2.5];
    comparisonData = [];

    elasticityValues.forEach(e => {
        let maxRevenue = -Infinity;
        let maxProfit = -Infinity;
        let optimalRevenuePrice = 0;
        let optimalProfitPrice = 0;

        for (let p = priceMin; p <= priceMax; p += 1) {
            const demand = calculateDemand(p, basePrice, baseDemand, e);
            const revenue = p * demand;
            const profit = revenue - (unitCost * demand);

            if (revenue > maxRevenue) {
                maxRevenue = revenue;
                optimalRevenuePrice = p;
            }
            if (profit > maxProfit) {
                maxProfit = profit;
                optimalProfitPrice = p;
            }
        }

        const fixedDemand = calculateDemand(basePrice, basePrice, baseDemand, e);
        const fixedRevenue = basePrice * fixedDemand;
        const fixedProfit = fixedRevenue - (unitCost * fixedDemand);

        const absE = Math.abs(e);
        let type = absE < 1 ? 'Inelastic' : absE === 1 ? 'Unit Elastic' : 'Elastic';

        comparisonData.push({
            elasticity: e,
            type: type,
            optimalRevenuePrice: optimalRevenuePrice,
            maxRevenue: maxRevenue,
            optimalProfitPrice: optimalProfitPrice,
            maxProfit: maxProfit,
            revenueGain: ((maxRevenue - fixedRevenue) / fixedRevenue) * 100,
            profitGain: ((maxProfit - fixedProfit) / fixedProfit) * 100
        });
    });

    plotComparisonCharts();
    updateComparisonTable();
    
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    tabs[1].classList.add('active');
    document.getElementById('comparison').classList.add('active');
}

function plotComparisonCharts() {
    const revenueGainTrace = {
        x: comparisonData.map(d => d.elasticity.toFixed(1)),
        y: comparisonData.map(d => d.revenueGain),
        type: 'bar',
        name: 'Revenue Gain (%)',
        marker: { color: '#007bff' }
    };

    Plotly.newPlot('comparisonRevenueChart', [revenueGainTrace], {
        xaxis: { title: 'Elasticity (ε)' },
        yaxis: { title: 'Revenue Gain (%)' },
        margin: { t: 20, r: 20, b: 50, l: 60 }
    });

    const revenuePriceTrace = {
        x: comparisonData.map(d => d.elasticity.toFixed(1)),
        y: comparisonData.map(d => d.optimalRevenuePrice),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Revenue-Optimal Price',
        line: { color: '#007bff', width: 2 },
        marker: { size: 8 }
    };

    const profitPriceTrace = {
        x: comparisonData.map(d => d.elasticity.toFixed(1)),
        y: comparisonData.map(d => d.optimalProfitPrice),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Profit-Optimal Price',
        line: { color: '#28a745', width: 2 },
        marker: { size: 8 }
    };

    Plotly.newPlot('comparisonPriceChart', [revenuePriceTrace, profitPriceTrace], {
        xaxis: { title: 'Elasticity (ε)' },
        yaxis: { title: 'Optimal Price (₹)' },
        margin: { t: 20, r: 20, b: 50, l: 60 }
    });
}

function updateComparisonTable() {
    const tbody = document.getElementById('comparisonTableBody');
    tbody.innerHTML = '';

    comparisonData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.elasticity.toFixed(1)}</td>
            <td>${row.type}</td>
            <td>₹${row.optimalRevenuePrice.toFixed(0)}</td>
            <td>₹${row.optimalProfitPrice.toFixed(0)}</td>
            <td class="${row.revenueGain > 0 ? 'positive' : 'negative'}">${row.revenueGain.toFixed(2)}%</td>
            <td class="${row.profitGain > 0 ? 'positive' : 'negative'}">${row.profitGain.toFixed(2)}%</td>
        `;
        tbody.appendChild(tr);
    });
}

function exportResults() {
    const data = {
        parameters: {
            basePrice: parseFloat(document.getElementById('basePrice').value),
            baseDemand: parseFloat(document.getElementById('baseDemand').value),
            elasticity: parseFloat(document.getElementById('elasticity').value),
            unitCost: parseFloat(document.getElementById('unitCost').value),
            strategy: document.getElementById('strategy').value,
            priceMin: parseFloat(document.getElementById('priceMin').value),
            priceMax: parseFloat(document.getElementById('priceMax').value)
        },
        results: currentResults,
        comparisonData: comparisonData,
        monteCarloResults: monteCarloResults,
        timestamp: new Date().toISOString(),
        project: 'POME - Dynamic Pricing Simulator',
        institution: 'RV College of Engineering'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pricing-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// NEW FEATURE 1: Market Structure Analysis
function calculateMarketStructure() {
    const structure = document.getElementById('marketStructure').value;
    const a = parseFloat(document.getElementById('demandIntercept').value);
    const b = parseFloat(document.getElementById('demandSlope').value);
    const mc = parseFloat(document.getElementById('marginalCost').value);
    const fc = parseFloat(document.getElementById('fixedCost').value);

    let price, quantity, profit, consumerSurplus, producerSurplus;

    if (structure === 'perfect') {
        // Perfect Competition: P = MC
        price = mc;
        quantity = (a - price) / b;
        profit = 0;
        
        const maxPrice = a;
        consumerSurplus = 0.5 * quantity * (maxPrice - price);
        producerSurplus = 0;
        
    } else if (structure === 'monopoly') {
        // Monopoly: MR = MC
        quantity = (a - mc) / (2 * b);
        price = a - b * quantity;
        
        const totalRevenue = price * quantity;
        const totalCost = mc * quantity + fc;
        profit = totalRevenue - totalCost;
        
        const maxPrice = a;
        consumerSurplus = 0.5 * quantity * (maxPrice - price);
        producerSurplus = profit + fc;
        
    } else {
        // Oligopoly (Cournot duopoly)
        const qPerFirm = (a - mc) / (3 * b);
        quantity = 2 * qPerFirm;
        price = a - b * quantity;
        
        const revenuePerFirm = price * qPerFirm;
        const costPerFirm = mc * qPerFirm + fc;
        const profitPerFirm = revenuePerFirm - costPerFirm;
        profit = 2 * profitPerFirm;
        
        const maxPrice = a;
        consumerSurplus = 0.5 * quantity * (maxPrice - price);
        producerSurplus = profit + (2 * fc);
    }

    document.getElementById('marketPrice').textContent = '₹' + price.toFixed(2);
    document.getElementById('marketQuantity').textContent = quantity.toFixed(0);
    document.getElementById('marketProfit').textContent = '₹' + profit.toFixed(2);
    document.getElementById('consumerSurplus').textContent = '₹' + consumerSurplus.toFixed(2);
    document.getElementById('producerSurplus').textContent = '₹' + producerSurplus.toFixed(2);

    plotMarketStructureCharts(a, b, mc, price, quantity, structure);
}

function plotMarketStructureCharts(a, b, mc, eqPrice, eqQuantity, structure) {
    const quantities = [];
    const demandPrices = [];
    const supplyCurve = [];
    
    for (let q = 0; q <= a/b; q += 10) {
        quantities.push(q);
        demandPrices.push(a - b * q);
        supplyCurve.push(mc);
    }

    const demandTrace = {
        x: quantities,
        y: demandPrices,
        type: 'scatter',
        mode: 'lines',
        name: 'Demand',
        line: { color: '#007bff', width: 2 }
    };

    const supplyTrace = {
        x: quantities,
        y: supplyCurve,
        type: 'scatter',
        mode: 'lines',
        name: 'Supply (MC)',
        line: { color: '#28a745', width: 2 }
    };

    const equilibriumTrace = {
        x: [eqQuantity],
        y: [eqPrice],
        type: 'scatter',
        mode: 'markers',
        name: 'Equilibrium',
        marker: { color: '#dc3545', size: 12 }
    };

    const traces = [demandTrace, supplyTrace, equilibriumTrace];
    
    if (structure === 'monopoly') {
        const mrPrices = [];
        for (let q = 0; q <= a/b; q += 10) {
            mrPrices.push(a - 2 * b * q);
        }
        traces.push({
            x: quantities,
            y: mrPrices,
            type: 'scatter',
            mode: 'lines',
            name: 'Marginal Revenue',
            line: { color: '#ffc107', width: 2, dash: 'dash' }
        });
    }

    Plotly.newPlot('marketChart', traces, {
        xaxis: { title: 'Quantity' },
        yaxis: { title: 'Price (₹)' },
        margin: { t: 20, r: 20, b: 50, l: 60 }
    });

    const welfareData = {
        x: ['Consumer Surplus', 'Producer Surplus', 'Deadweight Loss'],
        y: [
            parseFloat(document.getElementById('consumerSurplus').textContent.replace('₹', '')),
            parseFloat(document.getElementById('producerSurplus').textContent.replace('₹', '')),
            structure === 'perfect' ? 0 : calculateDeadweightLoss(a, b, mc, eqQuantity)
        ],
        type: 'bar',
        marker: { 
            color: ['#007bff', '#28a745', '#dc3545']
        }
    };

    Plotly.newPlot('welfareChart', [welfareData], {
        xaxis: { title: 'Welfare Component' },
        yaxis: { title: 'Value (₹)' },
        margin: { t: 20, r: 20, b: 50, l: 60 }
    });
}

function calculateDeadweightLoss(a, b, mc, monopolyQ) {
    const competitiveQ = (a - mc) / b;
    const dwl = 0.5 * b * Math.pow(competitiveQ - monopolyQ, 2);
    return dwl;
}

// NEW FEATURE 2: Price Discrimination
function toggleDiscriminationInputs() {
    const type = document.getElementById('discriminationType').value;
    document.getElementById('thirdDegreeInputs').style.display = type === 'third' ? 'block' : 'none';
    document.getElementById('secondDegreeInputs').style.display = type === 'second' ? 'block' : 'none';
    calculateDiscrimination();
}

function calculateDiscrimination() {
    const type = document.getElementById('discriminationType').value;
    const basePrice = parseFloat(document.getElementById('discBasePrice').value);
    const unitCost = parseFloat(document.getElementById('discUnitCost').value);

    if (type === 'none') {
        calculateUniformPricing(basePrice, unitCost);
    } else if (type === 'third') {
        calculateThirdDegree(basePrice, unitCost);
    } else if (type === 'second') {
        calculateSecondDegree(basePrice, unitCost);
    }
}

function calculateUniformPricing(basePrice, unitCost) {
    const baseDemand = 1300;
    const elasticity = -1.8;
    
    const demand = baseDemand * Math.pow(basePrice / 100, elasticity);
    const revenue = basePrice * demand;
    const profit = revenue - (unitCost * demand);

    document.getElementById('discRevenue').textContent = '₹' + revenue.toFixed(2);
    document.getElementById('discProfit').textContent = '₹' + profit.toFixed(2);
    document.getElementById('discImprovement').textContent = '0%';

    document.getElementById('discriminationResults').innerHTML = `
        <div class="metric-card" style="margin-top: 15px;">
            <h3>Uniform Pricing Strategy</h3>
            <div class="metric-detail">
                <span>Single Price:</span>
                <span>₹${basePrice.toFixed(2)}</span>
            </div>
            <div class="metric-detail">
                <span>Total Quantity:</span>
                <span>${demand.toFixed(0)} units</span>
            </div>
        </div>
    `;

    plotDiscriminationCharts(revenue, profit, 0, 'none');
}

function calculateThirdDegree(basePrice, unitCost) {
    const segmentAElasticity = parseFloat(document.getElementById('segmentAElasticity').value);
    const segmentABaseDemand = parseFloat(document.getElementById('segmentADemand').value);
    const segmentBElasticity = parseFloat(document.getElementById('segmentBElasticity').value);
    const segmentBBaseDemand = parseFloat(document.getElementById('segmentBDemand').value);

    const priceA = unitCost * segmentAElasticity / (segmentAElasticity + 1);
    const priceB = unitCost * segmentBElasticity / (segmentBElasticity + 1);

    const demandA = segmentABaseDemand * Math.pow(priceA / basePrice, segmentAElasticity);
    const demandB = segmentBBaseDemand * Math.pow(priceB / basePrice, segmentBElasticity);

    const revenueA = priceA * demandA;
    const revenueB = priceB * demandB;
    const totalRevenue = revenueA + revenueB;

    const profitA = revenueA - (unitCost * demandA);
    const profitB = revenueB - (unitCost * demandB);
    const totalProfit = profitA + profitB;

    const uniformDemand = (segmentABaseDemand + segmentBBaseDemand) * Math.pow(basePrice / 100, -1.8);
    const uniformRevenue = basePrice * uniformDemand;
    const uniformProfit = uniformRevenue - (unitCost * uniformDemand);

    const improvement = ((totalProfit - uniformProfit) / uniformProfit) * 100;

    document.getElementById('discRevenue').textContent = '₹' + totalRevenue.toFixed(2);
    document.getElementById('discProfit').textContent = '₹' + totalProfit.toFixed(2);
    document.getElementById('discImprovement').textContent = '+' + improvement.toFixed(2) + '%';

    document.getElementById('discriminationResults').innerHTML = `
        <div class="metrics" style="grid-template-columns: 1fr 1fr; margin-top: 15px;">
            <div class="metric-card">
                <h3>Segment A (Premium)</h3>
                <div class="metric-detail">
                    <span>Price:</span>
                    <span>₹${priceA.toFixed(2)}</span>
                </div>
                <div class="metric-detail">
                    <span>Quantity:</span>
                    <span>${demandA.toFixed(0)} units</span>
                </div>
                <div class="metric-detail">
                    <span>Revenue:</span>
                    <span>₹${revenueA.toFixed(2)}</span>
                </div>
            </div>
            <div class="metric-card">
                <h3>Segment B (Value)</h3>
                <div class="metric-detail">
                    <span>Price:</span>
                    <span>₹${priceB.toFixed(2)}</span>
                </div>
                <div class="metric-detail">
                    <span>Quantity:</span>
                    <span>${demandB.toFixed(0)} units</span>
                </div>
                <div class="metric-detail">
                    <span>Revenue:</span>
                    <span>₹${revenueB.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;

    plotDiscriminationCharts(totalRevenue, totalProfit, improvement, 'third', [
        { segment: 'Premium', revenue: revenueA, profit: profitA },
        { segment: 'Value', revenue: revenueB, profit: profitB }
    ]);
}

function calculateSecondDegree(basePrice, unitCost) {
    const tier1Discount = parseFloat(document.getElementById('tier1Discount').value);
    const tier2Discount = parseFloat(document.getElementById('tier2Discount').value);
    const tier3Discount = parseFloat(document.getElementById('tier3Discount').value);

    const price1 = basePrice * (1 - tier1Discount / 100);
    const price2 = basePrice * (1 - tier2Discount / 100);
    const price3 = basePrice * (1 - tier3Discount / 100);

    const demand1 = 300;
    const demand2 = 400;
    const demand3 = 600;

    const revenue1 = price1 * demand1;
    const revenue2 = price2 * demand2;
    const revenue3 = price3 * demand3;
    const totalRevenue = revenue1 + revenue2 + revenue3;

    const profit1 = (price1 - unitCost) * demand1;
    const profit2 = (price2 - unitCost) * demand2;
    const profit3 = (price3 - unitCost) * demand3;
    const totalProfit = profit1 + profit2 + profit3;

    const uniformRevenue = basePrice * 1300;
    const uniformProfit = (basePrice - unitCost) * 1300;
    const improvement = ((totalProfit - uniformProfit) / uniformProfit) * 100;

    document.getElementById('discRevenue').textContent = '₹' + totalRevenue.toFixed(2);
    document.getElementById('discProfit').textContent = '₹' + totalProfit.toFixed(2);
    document.getElementById('discImprovement').textContent = (improvement > 0 ? '+' : '') + improvement.toFixed(2) + '%';

    document.getElementById('discriminationResults').innerHTML = `
        <div class="metric-card" style="margin-top: 15px;">
            <h3>Quantity Discount Tiers</h3>
            <div class="metric-detail">
                <span>Tier 1 (0-100): ₹${price1.toFixed(2)}</span>
                <span>${demand1} units</span>
            </div>
            <div class="metric-detail">
                <span>Tier 2 (101-500): ₹${price2.toFixed(2)}</span>
                <span>${demand2} units</span>
            </div>
            <div class="metric-detail">
                <span>Tier 3 (501+): ₹${price3.toFixed(2)}</span>
                <span>${demand3} units</span>
            </div>
        </div>
    `;

    plotDiscriminationCharts(totalRevenue, totalProfit, improvement, 'second', [
        { tier: 'Tier 1', revenue: revenue1, profit: profit1 },
        { tier: 'Tier 2', revenue: revenue2, profit: profit2 },
        { tier: 'Tier 3', revenue: revenue3, profit: profit3 }
    ]);
}

function plotDiscriminationCharts(totalRevenue, totalProfit, improvement, type, breakdown) {
    const uniformRevenue = improvement === 0 ? totalRevenue : totalRevenue / (1 + improvement / 100);
    
    const revenueComparisonTrace = {
        x: ['Uniform Pricing', 'Price Discrimination'],
        y: [uniformRevenue, totalRevenue],
        type: 'bar',
        marker: { color: ['#6c757d', '#007bff'] }
    };

    Plotly.newPlot('discriminationChart', [revenueComparisonTrace], {
        xaxis: { title: 'Strategy' },
        yaxis: { title: 'Revenue (₹)' },
        margin: { t: 20, r: 20, b: 50, l: 60 }
    });

    if (breakdown && type !== 'none') {
        const labels = breakdown.map(b => b.segment || b.tier);
        const revenues = breakdown.map(b => b.revenue);

        const breakdownTrace = {
            x: labels,
            y: revenues,
            type: 'bar',
            marker: { color: ['#007bff', '#28a745', '#ffc107'] }
        };

        Plotly.newPlot('discriminationDetailsChart', [breakdownTrace], {
            xaxis: { title: type === 'third' ? 'Segment' : 'Tier' },
            yaxis: { title: 'Revenue (₹)' },
            margin: { t: 20, r: 20, b: 50, l: 60 }
        });
    }
}

// NEW FEATURE 3: Monte Carlo Simulation
function runMonteCarloSimulation() {
    const numSims = parseInt(document.getElementById('numSimulations').value);
    const basePrice = parseFloat(document.getElementById('mcBasePrice').value);
    const baseDemand = parseFloat(document.getElementById('mcBaseDemand').value);
    const demandStdDev = parseFloat(document.getElementById('demandStdDev').value) / 100;
    const elasticity = parseFloat(document.getElementById('mcElasticity').value);
    const elasticityStdDev = parseFloat(document.getElementById('elasticityStdDev').value);
    const unitCost = parseFloat(document.getElementById('mcUnitCost').value);
    const confidenceLevel = parseFloat(document.getElementById('confidenceLevel').value) / 100;

    const revenues = [];
    const profits = [];

    // Run simulations
    for (let i = 0; i < numSims; i++) {
        const randomDemand = baseDemand * (1 + boxMullerRandom() * demandStdDev);
        const randomElasticity = elasticity + boxMullerRandom() * elasticityStdDev;
        
        const demand = randomDemand * Math.pow(basePrice / 100, randomElasticity);
        const revenue = basePrice * demand;
        const profit = revenue - (unitCost * demand);
        
        revenues.push(revenue);
        profits.push(profit);
    }

    revenues.sort((a, b) => a - b);
    profits.sort((a, b) => a - b);

    const meanRevenue = revenues.reduce((a, b) => a + b) / numSims;
    const stdDevRevenue = Math.sqrt(revenues.reduce((sq, n) => sq + Math.pow(n - meanRevenue, 2), 0) / numSims);
    
    const varIndex = Math.floor(numSims * (1 - confidenceLevel));
    const var95 = revenues[varIndex];
    
    const lowerBound = revenues[Math.floor(numSims * 0.025)];
    const upperBound = revenues[Math.floor(numSims * 0.975)];
    
    const coefficientOfVariation = stdDevRevenue / meanRevenue;
    let riskLevel = '';
    if (coefficientOfVariation < 0.15) {
        riskLevel = '🟢 Low Risk';
    } else if (coefficientOfVariation < 0.30) {
        riskLevel = '🟡 Moderate Risk';
    } else {
        riskLevel = '🔴 High Risk';
    }

    document.getElementById('mcExpectedRevenue').textContent = '₹' + meanRevenue.toFixed(2);
    document.getElementById('mcRevenueStdDev').textContent = '₹' + stdDevRevenue.toFixed(2);
    document.getElementById('mcVaR').textContent = '₹' + var95.toFixed(2);
    document.getElementById('mcConfidenceInterval').textContent = 
        `₹${lowerBound.toFixed(2)} - ₹${upperBound.toFixed(2)}`;
    document.getElementById('mcRiskLevel').innerHTML = riskLevel;

    monteCarloResults = {
        revenues,
        profits,
        meanRevenue,
        stdDevRevenue,
        var95,
        confidenceInterval: [lowerBound, upperBound],
        riskLevel
    };

    plotMonteCarloCharts(revenues, profits);
    updatePercentileTable(revenues, profits);
}

function boxMullerRandom() {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function plotMonteCarloCharts(revenues, profits) {
    const histogramTrace = {
        x: revenues,
        type: 'histogram',
        nbinsx: 50,
        marker: { color: '#007bff' },
        name: 'Revenue Distribution'
    };

    Plotly.newPlot('mcHistogram', [histogramTrace], {
        xaxis: { title: 'Revenue (₹)' },
        yaxis: { title: 'Frequency' },
        margin: { t: 20, r: 20, b: 50, l: 60 }
    });

    const sortedRevenues = [...revenues].sort((a, b) => a - b);
    const cdf = sortedRevenues.map((_, i) => (i + 1) / revenues.length);

    const cdfTrace = {
        x: sortedRevenues,
        y: cdf,
        type: 'scatter',
        mode: 'lines',
        name: 'CDF',
        line: { color: '#28a745', width: 2 }
    };

    Plotly.newPlot('mcCDF', [cdfTrace], {
        xaxis: { title: 'Revenue (₹)' },
        yaxis: { title: 'Cumulative Probability' },
        margin: { t: 20, r: 20, b: 50, l: 60 }
    });
}

function updatePercentileTable(revenues, profits) {
    const tbody = document.getElementById('mcPercentileTable');
    tbody.innerHTML = '';

    const percentiles = [5, 10, 25, 50, 75, 90, 95];
    
    percentiles.forEach(p => {
        const index = Math.floor((revenues.length - 1) * p / 100);
        const revenue = revenues[index];
        const profit = profits[index];
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p}th</td>
            <td>₹${revenue.toFixed(2)}</td>
            <td>₹${profit.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Initialize on load
window.onload = function() {
    updateElasticity();
    calculate();
    calculateMarketStructure();
    calculateDiscrimination();
};