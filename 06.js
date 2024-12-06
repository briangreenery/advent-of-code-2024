const fs = require('fs');

let map = fs.readFileSync('input.txt').toString().trim().split('\n').map(line => line.split(''));

let ymax = map.length;
let xmax = map[0].length;

function findGuard() {
    for (let y = 0; y < ymax; y += 1) {
        for (let x = 0; x < xmax; x += 1) {
            if (map[y][x] === '^') {
                map[y][x] = '.';
                return {x, y};
            }
        }
    }
    process.exit(1);
}

const initialGuard = findGuard();

function part1() {
    let guard = { x: initialGuard.x, y: initialGuard.y };
    let dx = 0;
    let dy = -1;

    let visited = new Set();

    while (true) {
        visited.add(`${guard.x},${guard.y}`);

        let x = guard.x + dx;
        let y = guard.y + dy;

        if (x < 0 || x >= xmax || y < 0 || y >= ymax) {
            break;
        }

        if (map[y][x] !== '#') {
            guard.x += dx;
            guard.y += dy;
            continue;
        }

        if (dx === 1) {
            dx = 0;
            dy = 1;
        } else if (dy === 1) {
            dx = -1;
            dy = 0;
        } else if (dx === -1) {
            dx = 0;
            dy = -1;
        } else {
            dx = 1;
            dy = 0;
        }
    }

    console.log(visited.size);
    return visited;
}

function isLoop() {
    let guard = { x: initialGuard.x, y: initialGuard.y };
    // console.log(guard);
    let dx = 0;
    let dy = -1;

    let visited = new Set();

    while (true) {
        let key = `${guard.x},${guard.y},${dx},${dy}`;

        if (visited.has(key)) {
            return true;
        }

        visited.add(key);

        let x = guard.x + dx;
        let y = guard.y + dy;

        if (x < 0 || x >= xmax || y < 0 || y >= ymax) {
            return false;
        }

        if (map[y][x] !== '#') {
            guard.x += dx;
            guard.y += dy;
            continue;
        }

        if (dx === 1) {
            dx = 0;
            dy = 1;
        } else if (dy === 1) {
            dx = -1;
            dy = 0;
        } else if (dx === -1) {
            dx = 0;
            dy = -1;
        } else {
            dx = 1;
            dy = 0;
        }
    }
}

const visited = part1();

let sum = 0;

visited.forEach(spot => {
    let [x, y] = spot.split(',').map(Number);

    if (x === initialGuard.x && y === initialGuard.y) {
        return;
    }

    // console.log(`check ${x},${y}`);
    map[y][x] = '#';

    if (isLoop()) {
        sum += 1;
    }

    map[y][x] = '.';
});

console.log(sum);
