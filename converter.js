#!/usr/bin/env node

const metricMultipliers = {
    G: 1e9, M: 1e6, k: 1e3, h: 1e2, da: 1e1, '': 1,
    d: 1e-1, c: 1e-2, m: 1e-3, µ: 1e-6, n: 1e-9, p: 1e-12,
};

function convertTemp(from, to, value) {
    const val = parseFloat(value);
    if (isNaN(val)) return console.error("Invalid temperature.");
    if (from === "C" && to === "F") console.log(`${(val * 9/5 + 32).toFixed(1)} F`);
    else if (from === "F" && to === "C") console.log(`${((val - 32) * 5/9).toFixed(1)} C`);
    else console.error("Use C or F only.");
}

function toScientificNotation(value) {
    const num = parseFloat(value);
    if (isNaN(num)) return console.error("Invalid number.");
    console.log(num.toExponential());
}

function convertPrefix(fromUnit, toUnit, value) {
    const val = parseFloat(value);
    const [fromPrefix, fromBase] = splitUnit(fromUnit);
    const [toPrefix, toBase] = splitUnit(toUnit);

    if (isNaN(val) || fromBase !== toBase) return console.error("Invalid or incompatible units.");
    const result = (val * metricMultipliers[fromPrefix]) / metricMultipliers[toPrefix];
    console.log(`${result} ${toUnit}`);
}

function splitUnit(unit) {
    const match = unit.match(/^([GMkhdcmunpµ]?)([a-zA-Z]+)$/);
    return match ? [match[1], match[2]] : ["", ""];
}

function convertRepeatingDecimal(decimal) {
    const match = decimal.match(/^(\d*)\.(\d*)\.\.\.$/);
    if (!match || !match[2]) return console.error("Invalid format. Use like 0.666...");
    const [intPart, repeat] = [match[1] || "0", match[2]];
    const numerator = parseInt(repeat);
    const denominator = parseInt('9'.repeat(repeat.length));
    const mixedNum = parseInt(intPart) * denominator + numerator;
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    const divisor = gcd(mixedNum, denominator);
    console.log(`${mixedNum / divisor}/${denominator / divisor}`);
}

function showHelp() {
    console.log(`
Usage:
  temp --from C --to F 100
  to-sci 12345
  prefix --from km --to m 5
  to-fraction 0.666...
`);
}

const args = process.argv.slice(2);
const cmd = args[0];

switch (cmd) {
    case "temp":
        convertTemp(args[2], args[4], args[5]);
        break;
    case "to-sci":
        toScientificNotation(args[1]);
        break;
    case "prefix":
        convertPrefix(args[2], args[4], args[5]);
        break;
    case "to-fraction":
        convertRepeatingDecimal(args[1]);
        break;
    default:
        showHelp();
}
