const fs = require('fs');

let map = fs.readFileSync('input.txt').toString().trim().split('\n').map(line => line.split(''));
const xlen = map[0].length;
const ylen = map.length;

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

function search() {
    let seen = new Map();
    let best = Infinity;

    let prev = [{ x: start.x, y: start.y, d: 'E', score: 0, path: [] }];

    let bestPaths = new Map();

    while (prev.length !== 0) {
        let next = [];

        function addNext(x, y, d, score, path) {
            if (map[y][x] === '#') {
                return;
            }

            if (score > best) {
                return;
            }

            if (y === end.y && x === end.x) {
                best = Math.min(best, score);
                let thing = bestPaths.get(score);
                if (thing === undefined) {
                    bestPaths.set(score, [path]);
                } else {
                    thing.push(path);
                }
                return;
            }

            const key = `${x},${y},${d}`;
            const value = seen.get(key);
            if (value !== undefined && value < score) {
                return;
            }

            seen.set(key, score);
            next.push({ x, y, d, score, path: path.concat([{x, y}]) });
        }

        prev.forEach(n => {
            switch (n.d) {
                case 'N':
                    addNext(n.x, n.y - 1, 'N', n.score + 1, n.path);
                    addNext(n.x, n.y, 'E', n.score + 1000, n.path);
                    addNext(n.x, n.y, 'W', n.score + 1000, n.path);
                    break;
                case 'S':
                    addNext(n.x, n.y + 1, 'S', n.score + 1, n.path);
                    addNext(n.x, n.y, 'E', n.score + 1000, n.path);
                    addNext(n.x, n.y, 'W', n.score + 1000, n.path);
                    break;
                case 'E':
                    addNext(n.x + 1, n.y, 'E', n.score + 1, n.path);
                    addNext(n.x, n.y, 'N', n.score + 1000, n.path);
                    addNext(n.x, n.y, 'S', n.score + 1000, n.path);
                    break;
                case 'W':
                    addNext(n.x - 1, n.y, 'W', n.score + 1, n.path);
                    addNext(n.x, n.y, 'N', n.score + 1000, n.path);
                    addNext(n.x, n.y, 'S', n.score + 1000, n.path);
                    break;
            }
        });

        prev = next;
    }

    let spots = new Set();
    spots.add(`${start.x},${start.y}`);
    spots.add(`${end.x},${end.y}`);

    bestPaths.get(best).forEach(path => {
        path.forEach(cell => spots.add(`${cell.x},${cell.y}`));
    });

    console.log(best);
    console.log(spots.size);
}

search();
