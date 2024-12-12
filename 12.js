const fs = require('fs');

const input = fs.readFileSync('input.txt').toString().trim().split('\n').map(line => line.split(''));
const xmax = input[0].length;
const ymax = input.length;

function ok(x, y) {
    return x >= 0 && x < xmax && y >= 0 && y < ymax;
}

function makeKey(x, y) {
    return `${x},${y}`;
}

function add(set, x, y) {
    set.add(makeKey(x, y));
}

function has(set, x, y) {
    return set.has(makeKey(x, y));
}

let globalSeen = new Set();

function getRegion(x, y) {
    let cell = input[y][x];
    let seen = new Set();

    let queue = [{ x, y }];
    add(seen, x, y);
    add(globalSeen, x, y);

    let h = [];
    let v = [];

    function n(x, y, f) {
        if (f(x + 1, y)) {
            v.push({ x: x + 1, ymin: y, ymax: y + 1, t: 0 });
        }
        if (f(x - 1, y)) {
            v.push({ x: x, ymin: y, ymax: y + 1, t: 1 });
        }
        if (f(x, y + 1)) {
            h.push({ y: y + 1, xmin: x, xmax: x + 1, t: 0 });
        }
        if (f(x, y - 1)) {
            h.push({ y: y, xmin: x, xmax: x + 1, t: 1 });
        }
    }

    while (queue.length !== 0) {
        let point = queue.pop();

        n(point.x, point.y, (xn, yn) => {
            if (!ok(xn, yn)) {
                return true;
            }

            if (input[yn][xn] !== cell) {
                return true;
            }

            if (has(seen, xn, yn)) {
                return false;
            }

            add(seen, xn, yn);
            add(globalSeen, xn, yn);
            queue.push({ x: xn, y: yn });
            return false;
        });
    }

    h.sort((a, b) => {
        if (a.y !== b.y) {
            return a.y - b.y;
        }
        if (a.t !== b.t) {
            return a.t - b.t;
        }
        return a.xmin - b.xmin;
    });

    v.sort((a, b) => {
        if (a.x !== b.x) {
            return a.x - b.x;
        }
        if (a.t !== b.t) {
            return a.t - b.t;
        }
        return a.ymin - b.ymin;
    });

    let sides = 0;

    for (let i = 0; i < h.length; i += 1) {
        if (i === 0) {
            sides += 1;
            continue;
        }

        let prev = h[i - 1];
        let next = h[i];

        if (prev.y === next.y && prev.xmax === next.xmin && prev.t === next.t) {
            continue;
        }

        sides += 1;
    }

    for (let i = 0; i < v.length; i += 1) {
        if (i === 0) {
            sides += 1;
            continue;
        }

        let prev = v[i - 1];
        let next = v[i];

        if (prev.x === next.x && prev.ymax === next.ymin && prev.t === next.t) {
            continue;
        }

        sides += 1;
    }

    return { perimeter: v.length + h.length, sides: sides, area: seen.size };
}

let part1 = 0;
let part2 = 0;

for (let y = 0; y < ymax; y += 1) {
    for (let x = 0; x < xmax; x += 1) {
        if (has(globalSeen, x, y)) {
            continue;
        }

        let result = getRegion(x, y);
        part1 += result.area * result.perimeter;
        part2 += result.area * result.sides;
    }
}

console.log(part1);
console.log(part2);
