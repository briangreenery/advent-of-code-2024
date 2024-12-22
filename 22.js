const fs = require('fs');

let numbers = fs.readFileSync('input.txt').toString().trim().split('\n').map(Number);

function prune(a) {
    return a % 16777216;
}

function mix(a, b) {
    return prune(a) ^ prune(b);
}

function nextSecret(number) {
    let a = mix(number, number * 64);
    let b = mix(a, Math.floor(a / 32));
    return mix(b, b * 2048);
}

let sum = 0;

function wrappingAppend(arr, n) {
    arr[0] = arr[1];
    arr[1] = arr[2];
    arr[2] = arr[3];
    arr[3] = n;
}

function getPrice(n) {
    return n % 10;
}

let history = [0, 0, 0, 0];
let map = new Map();

function addBest(key, price) {
    let value = map.get(key);
    if (value === undefined) {
        map.set(key, price);
    } else {
        map.set(key, price + value);
    }
}

numbers.forEach(number => {
    let prevPrice = getPrice(number);

    let seen = new Set();

    for (let i = 0; i < 2000; i += 1) {
        number = nextSecret(number);
        let nextPrice = getPrice(number);
        wrappingAppend(history, nextPrice - prevPrice);

        if (i >= 3) {
            let key = history.join('');
            if (!seen.has(key)) {
                seen.add(key);
                addBest(key, nextPrice);
            }
        }

        prevPrice = nextPrice;
    }
});

let best = 0;

map.forEach(value => {
    best = Math.max(best, value);
})

console.log(best);
