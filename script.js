// Definición de las unidades de medida
const units = {
    length: {
        metros: 1,
        kilometros: 0.001,
        centimetros: 100,
        milimetros: 1000,
        pulgadas: 39.3701,
        pies: 3.28084,
        yardas: 1.09361,
        millas: 0.000621371
    },
    weight: {
        kilogramos: 1,
        gramos: 1000,
        miligramos: 1000000,
        libras: 2.20462,
        onzas: 35.274
    },
    temperature: {
        celsius: 1,
        fahrenheit: 33.8,
        kelvin: 274.15
    },
    volume: {
        litros: 1,
        mililitros: 1000,
        galones: 0.264172,
        pintas: 2.11338
    },
    time: {
        segundos: 1,
        minutos: 1 / 60,
        horas: 1 / 3600,
        dias: 1 / 86400
    },
    weightToVolume: {
        kilogramos: { litros: 1, galones: 0.264172 }, // Densidad del agua: 1 kg ≈ 1 litro
        gramos: { mililitros: 1, pintas: 0.00211338 }
    },
    currency: {
        usd: 1, // Dólar estadounidense (base)
        eur: 0, // Euro (se actualizará con la API)
        gbp: 0, // Libra esterlina (se actualizará con la API)
        jpy: 0, // Yen japonés (se actualizará con la API)
        mxn: 0  // Peso mexicano (se actualizará con la API)
    }
};

// Elementos del DOM
const unitType = document.getElementById('unitType');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const inputValue = document.getElementById('inputValue');
const convertBtn = document.getElementById('convertBtn');
const result = document.getElementById('result');
const historyList = document.getElementById('historyList');
const swapUnitsBtn = document.getElementById('swapUnits');
const clearHistoryBtn = document.getElementById('clearHistory');

// Función para cargar las unidades en los selectores
function loadUnits() {
    const type = unitType.value;
    let unitList;

    if (type === 'weightToVolume') {
        unitList = Object.keys(units.weight);
    } else {
        unitList = Object.keys(units[type]);
    }

    fromUnit.innerHTML = unitList.map(unit => `<option value="${unit}">${unit}</option>`).join('');
    toUnit.innerHTML = unitList.map(unit => `<option value="${unit}">${unit}</option>`).join('');
}

// Cargar unidades al cambiar el tipo de unidad
unitType.addEventListener('change', loadUnits);

// Función para convertir unidades
function convert() {
    const type = unitType.value;
    const from = fromUnit.value;
    const to = toUnit.value;
    const value = parseFloat(inputValue.value);

    if (isNaN(value)) {
        result.textContent = "Ingresa un valor válido";
        return;
    }

    let convertedValue;

    if (type === 'temperature') {
        // Conversión de temperatura
        if (from === 'celsius' && to === 'fahrenheit') {
            convertedValue = (value * 9/5) + 32;
        } else if (from === 'fahrenheit' && to === 'celsius') {
            convertedValue = (value - 32) * 5/9;
        } else if (from === 'celsius' && to === 'kelvin') {
            convertedValue = value + 273.15;
        } else if (from === 'kelvin' && to === 'celsius') {
            convertedValue = value - 273.15;
        } else if (from === 'fahrenheit' && to === 'kelvin') {
            convertedValue = (value - 32) * 5/9 + 273.15;
        } else if (from === 'kelvin' && to === 'fahrenheit') {
            convertedValue = (value - 273.15) * 9/5 + 32;
        } else {
            convertedValue = value;
        }
    } else if (type === 'weightToVolume') {
        // Conversión de peso a volumen (basado en la densidad del agua)
        if (from === 'kilogramos' && to === 'litros') {
            convertedValue = value * 1; // 1 kg ≈ 1 litro
        } else if (from === 'gramos' && to === 'mililitros') {
            convertedValue = value * 1; // 1 g ≈ 1 ml
        } else {
            convertedValue = "Conversión no soportada";
        }
    } else if (type === 'currency') {
        // Conversión de monedas (usando la API)
        convertedValue = value * (units.currency[to] / units.currency[from]);
    } else {
        // Conversión de longitud, peso, volumen o tiempo
        convertedValue = value * (units[type][to] / units[type][from]);
    }

    result.textContent = `${value} ${from} = ${convertedValue.toFixed(2)} ${to}`;
    addToHistory(value, from, convertedValue, to); // Agregar al historial
}

// Función para agregar al historial
function addToHistory(value, from, convertedValue, to) {
    const historyItem = document.createElement('li');
    historyItem.textContent = `${value} ${from} = ${convertedValue.toFixed(2)} ${to}`;
    historyList.appendChild(historyItem);
}

// Evento para el botón de conversión
convertBtn.addEventListener('click', convert);

// Evento para intercambiar unidades
swapUnitsBtn.addEventListener('click', () => {
    const temp = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = temp;
});

// Evento para limpiar el historial
clearHistoryBtn.addEventListener('click', () => {
    historyList.innerHTML = '';
});

// Validación de entradas
inputValue.addEventListener('input', () => {
    if (isNaN(inputValue.value)) {
        inputValue.style.borderColor = 'red';
    } else {
        inputValue.style.borderColor = '#ccc';
    }
});

// Cargar unidades al inicio
loadUnits();

// Obtener tasas de cambio de monedas en tiempo real
async function fetchCurrencyRates() {
    const apiKey = 'TU_API_KEY'; // Reemplaza con tu API key
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
    const data = await response.json();
    units.currency.eur = data.rates.EUR;
    units.currency.gbp = data.rates.GBP;
    units.currency.jpy = data.rates.JPY;
    units.currency.mxn = data.rates.MXN;
}

fetchCurrencyRates();