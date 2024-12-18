const fs = require('fs');

let input = fs.readFileSync('input.txt').toString().trim().split('\n').map(line => {
    let [x, y] = line.split(',').map(Number);
    return { x, y };
});

let xmax = ymax = 70;
let xlen = ylen = xmax + 1;

let start = { x: 0, y: 0 };
let end = { x: xmax, y: ymax };

function can(map) {
    let seen = new Set();

    let prev = [{ x: start.x, y: start.y, d: 0 }];
    let best = Infinity;

    while (prev.length !== 0) {
        let next = [];

        function addNext(x, y, d) {
            if (x < 0 || x >= xlen || y < 0 || y >= ylen) {
                return;
            }

            if (map[y][x] === '#') {
                return;
            }

            if (d > best) {
                return;
            }

            if (y === end.y && x === end.x) {
                best = Math.min(best, d);
                return;
            }

            const key = `${x},${y}`;
            if (seen.has(key)) {
                return;
            }

            seen.add(key);
            next.push({ x, y, d });
        }

        prev.forEach(n => {
            addNext(n.x - 1, n.y, n.d + 1);
            addNext(n.x + 1, n.y, n.d + 1);
            addNext(n.x, n.y - 1, n.d + 1);
            addNext(n.x, n.y + 1, n.d + 1);
        });

        prev = next;
    }

    return best < Infinity;
}

let map = [];
for (let y = 0; y < ylen; y += 1) {
    let row = [];
    for (let x = 0; x < xlen; x += 1) {
        row.push(0);
    }
    map.push(row);
}

for (let i = 0; ; i += 1) {
    let { x, y } = input[i];
    map[y][x] = '#';

    if (!can(map)) {
        console.log(`at ${i} -> ${x},${y}`);
        break;
    }
}
