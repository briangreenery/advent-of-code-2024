const fs = require('fs');

let [a, b] = fs.readFileSync('input.txt').toString().trim().split('\n\n');
let towels = a.split(', ');
let lines = b.split('\n');

function count(pattern, i, memo) {
    if (i === pattern.length) {
        return 1;
    }

    let cached = memo[i];
    if (cached >= 0) {
        return cached;
    }

    let ans = 0;
    towels.forEach(towel => {
        if (pattern.startsWith(towel, i)) {
            ans += count(pattern, i + towel.length, memo);
        }
    });

    memo[i] = ans;
    return ans;
}

let max = 0;
lines.forEach(line => max = Math.max(max, line.length));

let sum = 0;
let distinct = 0;

lines.forEach(line => {
    let memo = new Array(max).fill(-1);
    let result = count(line, 0, memo);
    if (result > 0) {
        sum += 1;
        distinct += result;
    }
});
console.log(sum);
console.log(distinct);
