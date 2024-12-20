const fs = require('fs');

let map = fs.readFileSync('input.txt').toString().trim().split('\n').map(line => line.split(''));
const xlen = map[0].length;
const ylen = map.length;

function makeCache(value) {
    let rows = [];

    for (let y = 0; y < ylen; y += 1) {
        rows.push(new Array(xlen).fill(value));
    }

    return rows;
}

function makeMoves(x, y, d) {
    return [
        { x: x - d, y },
        { x: x + d, y },
        { x, y: y - d },
        { x, y: y + d },
    ];
}

function makeMoves2(x, y, d) {
    let result = [];

    for (let dx = -d; dx <= d; dx += 1) {
        for (let dy = -d; dy <= d; dy += 1) {
            if (Math.abs(dx) + Math.abs(dy) <= d) {
                result.push({ x: x + dx, y: y + dy });
            }
        }
    }

    return result;
}

function findSpot(which) {
    for (let y = 0; y < ylen; y += 1) {
        for (let x = 0; x < xlen; x += 1) {
            if (map[y][x] === which) {
                map[y][x] = '.';
                return { x, y };
            }
        }
    }

    process.exit(1);
}

const start = findSpot('S');
const end = findSpot('E');

function ok(x, y) {
    return x >= 0 && x < xlen && y >= 0 && y < ylen && map[y][x] !== '#';
}

function findDistances(seen, dist) {
    let prev = [{ x: end.x, y: end.y }];
    seen[end.y][end.x] = true;
    dist[end.y][end.x] = 0;

    let sofar = 0;

    while (prev.length !== 0) {
        let next = [];
        sofar += 1;

        prev.forEach(spot => {
            makeMoves(spot.x, spot.y, 1).forEach(move => {
                if (!ok(move.x, move.y) || seen[move.y][move.x]) {
                    return;
                }

                seen[move.y][move.x] = true;
                dist[move.y][move.x] = sofar;
                next.push({ x: move.x, y: move.y });
            });
        });

        prev = next;
    }

    return sofar;
}

let dist = makeCache(Infinity);
let seen = makeCache(false);
let normal = findDistances(seen, dist);

let counts = new Map();
let sum = 0;

for (let y = 0; y < ylen; y += 1) {
    for (let x = 0; x < xlen; x += 1) {
        makeMoves2(x, y, 20).forEach(move => {
            if (!ok(move.x, move.y)) {
                return;
            }

            if (!seen[y][x] || !seen[move.y][move.x]) {
                return;
            }

            let cheatDistance = Math.abs(move.x - x) + Math.abs(move.y - y);
            let jumpDist = (normal - dist[y][x]) + dist[move.y][move.x] + cheatDistance;
            if (jumpDist < normal) {
                let saving = normal - jumpDist;

                if (saving < 100) {
                    return;
                }

                sum += 1;

                // let sofar = counts.get(saving);
                // if (sofar === undefined) {
                //     counts.set(saving, 1);
                // } else {
                //     counts.set(saving, sofar + 1);
                // }
            }
        });
    }
}

// let sorted = [];
// counts.forEach((value, key) => {
//     sorted.push({ key, value });
// });
// sorted.sort((a, b) => a.key - b.key);
// sorted.forEach(entry => {
//     console.log(`There are ${entry.value} cheats that save ${entry.key} picoseconds.`);
// });

console.log(sum);
