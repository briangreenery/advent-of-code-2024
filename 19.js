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

    for (let j = 0; j < towels.length; j += 1) {
        let towel = towels[j];
        if (pattern.startsWith(towel, i)) {
            ans += count(pattern, i + towel.length, memo);
        }
    }

    memo[i] = ans;
    return ans;
}

let max = 0;
lines.forEach(line => max = Math.max(max, line.length));

let memo = [];
for (let i = 0; i < max; i += 1) {
    memo.push(-1);
}

let sum = 0;
let distinct = 0;

lines.forEach(line => {
    let result = count(line, 0, memo);
    if (result > 0) {
        sum += 1;
        distinct += result;
    }

    for (let i = 0; i < max; i += 1) {
        memo[i] = -1;
    }
});
console.log(sum);
console.log(distinct);
