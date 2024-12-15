const fs = require('fs');

let [map, moves] = fs.readFileSync('input.txt').toString().trim().split('\n\n');

map = map.split('\n').map(row => row.split(''));
moves = moves.split('');

let xlen = map[0].length;
let ylen = map.length;

function embiggen() {
    let bigger = [];

    for (let y = 0; y < ylen; y += 1) {
        let row = [];
        for (let x = 0; x < xlen; x += 1) {
            const cell = map[y][x];
            switch (cell) {
                case '#':
                case '.':
                    row.push(cell);
                    row.push(cell);
                    break;
                case 'O':
                    row.push('[');
                    row.push(']');
                    break;
                case '@':
                    row.push(cell);
                    row.push('.');
                    break;
            }
        }
        bigger.push(row);
    }

    return bigger;
}

map = embiggen();
xlen = map[0].length;
ylen = map.length;

function findRobot() {
    for (let y = 0; y < ylen; y += 1) {
        for (let x = 0; x < xlen; x += 1) {
            if (map[y][x] === '@') {
                map[y][x] = '.';
                return { x, y };
            }
        }
    }
    process.exit(1);
}

let robot = findRobot();

function moveSimple(dx, dy) {
    let x = robot.x;
    let y = robot.y;

    while (true) {
        x += dx;
        y += dy;

        let cell = map[y][x];
        if (cell === '#') {
            return;
        }
        if (cell === '.') {
            break;
        }
    }

    while (x !== robot.x || y !== robot.y) {
        map[y][x] = map[y - dy][x - dx];
        x -= dx;
        y -= dy;
    }

    robot.x += dx;
    robot.y += dy;
}

function getLine(xs, y) {
    let blocked = false;

    let next = new Set();
    xs.forEach(x => {
        switch (map[y][x]) {
            case '#':
                blocked = true;
                break;
            case '[':
                next.add(x);
                next.add(x + 1);
                break;
            case ']':
                next.add(x);
                next.add(x - 1);
                break;
        }
    });

    return { blocked, next };
}

function moveComplicated(dy) {
    let xs = new Set();
    xs.add(robot.x);

    let toMove = [];

    let y = robot.y;

    while (true) {
        y += dy;

        let { blocked, next } = getLine(xs, y);
        if (blocked) {
            return;
        }

        if (next.size === 0) {
            break;
        }

        next.forEach(x => {
            toMove.push({x, y});
        });

        xs = next;
    }

    toMove.reverse();

    toMove.forEach(cell => {
        map[cell.y + dy][cell.x] = map[cell.y][cell.x];
        map[cell.y][cell.x] = '.';
    });

    robot.y += dy;
}

function applyMove(m) {
    switch (m) {
        case '<':
            moveSimple(-1, 0);
            break;
        case '>':
            moveSimple(1, 0);
            break;
        case '^':
            moveComplicated(-1);
            break;
        case 'v':
            moveComplicated(1);
            break;
    }
}

function print() {
    for (let y = 0; y < ylen; y += 1) {
        let line = [];
        for (let x = 0; x < xlen; x += 1) {
            if (robot.x === x && robot.y === y) {
                line.push('@');
            } else {
                line.push(map[y][x]);
            }
        }

        console.log(line.join(''));
    }
    console.log('');
}

function score() {
    let sum = 0;

    for (let y = 0; y < ylen; y += 1) {
        for (let x = 0; x < xlen; x += 1) {
            if (map[y][x] === 'O' || map[y][x] === '[') {
                sum += 100 * y + x;
            }
        }
    }

    return sum;
}

// console.log('Initial state:');
// print();
moves.forEach(m => {
    applyMove(m);
    // console.log(`Move ${m}:`);
    // print();
});

console.log(score());
