const fs = require('fs');

const rounds = fs.readFileSync('input.txt').toString().trim().split('\n\n').map(r => {
    let lines = r.split('\n').map(l => l.split(': ')[1].split(', ').map(x => x.substring(2)).map(Number));

    let [ax, ay] = lines[0];
    let [bx, by] = lines[1];
    let [px, py] = lines[2];

    const big = 0;
    return { a: { x: ax, y: ay }, b: { x: bx, y: by }, p: { x: px + big, y: py + big } };
});

function solve(r, big) {
    let px = r.p.x + big;
    let py = r.p.y + big;

    let b = (px * r.a.y - r.a.x * py) / (r.b.x * r.a.y - r.b.y * r.a.x);
    let a = (px - b * r.b.x) / r.a.x;

    if (a === Math.round(a) && b === Math.round(b)) {
        return 3 * a + b;
    }

    return Infinity;
}

let sum = 0;
rounds.forEach(r => {
    let min = solve(r, 10000000000000);
    if (min < Infinity) {
        sum += min;
    }
});
console.log(sum);
