const fs = require('fs');

const input = fs.readFileSync('input.txt').toString().trim().split(' ').map(Number);

function makeKey(n, steps) {
    return `${n},${steps}`;
}

function simulate(n, steps, memo) {
    if (steps === 0) {
        return 1;
    }

    let key = makeKey(n, steps);
    let cached = memo.get(key);
    if (cached !== undefined) {
        return cached;
    }

    let ans = 0;

    if (n === 0) {
        ans = simulate(1, steps - 1, memo);
    } else {
        let str = n.toString();
        if (str.length % 2 === 0) {
            let left = Number(str.substring(0, str.length / 2));
            let right = Number(str.substring(str.length / 2, str.length));
            ans = simulate(left, steps - 1, memo) + simulate(right, steps - 1, memo);
        } else {
            ans = simulate(n * 2024, steps - 1, memo);
        }
    }

    memo.set(key, ans);
    return ans;
}

let memo = new Map();
let sum = input.map(number => simulate(number, 75, memo)).reduce((a, b) => a + b);
console.log(sum);

