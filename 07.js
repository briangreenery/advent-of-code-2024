const fs = require('fs');

let lines = fs.readFileSync('input.txt').toString().trim().split('\n');

function can(target, numbers, sofar, index) {
    if (index === numbers.length) {
        return sofar === target;
    }

    return can(target, numbers, sofar + numbers[index], index + 1) ||
           can(target, numbers, sofar * numbers[index], index + 1) ||
           can(target, numbers, Number(`${sofar}${numbers[index]}`), index + 1);
}

let sum = 0;

lines.forEach(line => {
    let parts = line.split(': ');

    let target = Number(parts[0]);
    let numbers = parts[1].split(' ').map(Number);

    if (can(target, numbers, numbers[0], 1)) {
        sum += target;
    }
});

console.log(sum);
