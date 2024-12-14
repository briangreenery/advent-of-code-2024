const fs = require('fs');

const xlen = 101;
const ylen = 103;

const xmid = Math.floor(xlen / 2);
const ymid = Math.floor(ylen / 2);

function makeUnsigned(n, d) {
    return (n + d) % d;
}

// 10x10 ignoring the center 1 (from left to right)

let map = [];
for (let y = 0; y < ylen; y += 1) {
    let line = [];
    for (let x = 0; x < xlen; x += 1) {
        line.push(0);
    }
    map.push(line);
}

let cols = [];
for (let x = 0; x < xlen; x += 1) {
    cols.push(0);
}

let quadrants = [0, 0, 0, 0];

function addQuadrant(x, y, n) {
    if (x < xmid && y < ymid) {
        quadrants[0] += n;
    } else if (x < xmid && (ylen - y) <= ymid) {
        quadrants[1] += n;
    } else if ((xlen - x) <= xmid && y < ymid) {
        quadrants[2] += n;
    } else if ((xlen - x) <= xmid && (ylen - y) <= ymid) {
        quadrants[3] += n;
    }
}

let pixels = [];
for (let a = 0; a < 10; a += 1) {
    let row = [];
    for (let b = 0; b < 10; b += 1) {
        row.push(0);
    }
    pixels.push(row);
}

let robots = fs.readFileSync('input.txt').toString().trim().split('\n').map(line => {
    let [a, b] = line.split(' ');
    let [px, py] = a.substring(2).split(',').map(Number);
    let [vx, vy] = b.substring(2).split(',').map(Number);
    map[py][px] += 1;
    addPixel(px, py, 1);
    addQuadrant(px, py, 1);
    return { px, py, vx, vy };
});

function getPixelX(x) {
    if (x < 50) {
        return Math.floor(x / 10);
    }
    if (x >= 51) {
        return Math.floor((x - 1) / 10);
    }
    return -1;
}

function getPixelY(y) {
    if (y < 50) {
        return Math.floor(y / 10);
    }
    if (y >= 53) {
        return Math.floor((y - 3) / 10);
    }
    return -1;
}

function addPixel(x, y, n) {
    let px = getPixelX(x);
    let py = getPixelY(y);
    if (px >= 0 && py >= 0) {
        pixels[py][px] += n;
    }
}

function step(robot) {
    map[robot.py][robot.px] -= 1;
    addPixel(robot.px, robot.py, -1);
    addQuadrant(robot.px, robot.py, -1);
    robot.px = makeUnsigned(robot.px + robot.vx, xlen);
    robot.py = makeUnsigned(robot.py + robot.vy, ylen);
    addQuadrant(robot.px, robot.py, 1);
    addPixel(robot.px, robot.py, 1);
    map[robot.py][robot.px] += 1;
}

function part1() {
    for (let i = 0; i < 100; i += 1) {
        robots.forEach(step);
    }

    // print();
    console.log(quadrants[0] * quadrants[1] * quadrants[2] * quadrants[3]);
}

// part1();

function print() {
    for (let y = 0; y < ylen; y += 1) {
        let line = [];
        for (let x = 0; x < xlen; x += 1) {
            let count = map[y][x];
            if (count > 0) {
                line.push(count);
            } else {
                line.push('.');
            }
        }
        console.log(line.join(''));
    }
    console.log('');
    console.log('');
}

function hasSpacing(row, start, n) {
    let count = 0;
    for (let x = start; x < xlen && count < 10; x += n) {
        if (row[x] === 0) {
            return false;
        }
        count += 1;
    }
    return count === 10;
}

function maybeTree2() {
    for (let y = 0; y < ylen; y += 1) {
        let row = map[y];
        for (let x = 0; x < xlen; x += 1) {
            for (let spacing = 1; spacing <= 10; spacing += 1) {
                if (hasSpacing(row, x, spacing)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function maybeTree() {
    const fudge = 7;

    if (quadrants[0] + quadrants[2] - quadrants[1] - quadrants[3] > fudge) {
        return false;
    }

    // if (Math.abs(quadrants[0] - quadrants[2]) < 10 && Math.abs(quadrants[1] - quadrants[3]) < 10) {
    //     return true;
    // }

    for (let y = 0; y < 10; y += 1) {
        for (let x = 0; x < 5; x += 1) {
            if (Math.abs(pixels[y][x] - pixels[y][10 - x - 1]) > fudge) {
                return false;
            }
        }
    }

    return true;
}

function makeKey() {
    return JSON.stringify(robots);
}

function sleep() {
    return new Promise((resolve) => {
        setTimeout(resolve, 150);
    });
}

async function part2() {
    let count = 0;
    let set = new Set();
    while (true) {
        robots.forEach(step);
        count += 1;

        let key = JSON.stringify(robots);
        if (set.has(key)) {
            break;
        }

        set.add(key);

        if (maybeTree2()) {
            console.log(count);
            print();
            await sleep();
        }
    }
}

// part1();
part2();
