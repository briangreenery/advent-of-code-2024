const fs = require('fs');

const input = fs.readFileSync('input.txt').toString().trim().split('\n').map(line => line.split(''));

const xmax = input[0].length;
const ymax = input.length;

function part1() {
    function n(x, y, fn) {
        fn(x + 1, y);
        fn(x - 1, y);
        fn(x, y + 1);
        fn(x, y - 1);
    }

    function get(which, map) {
        let out = new Map();

        for (let y = 0; y < ymax; y += 1) {
            for (let x = 0; x < xmax; x += 1) {
                let cell = Number(input[y][x]);

                if (cell !== which) {
                    continue;
                }

                let key = `${x},${y}`;

                n(x, y, (xn, yn) => {
                    let nkey = `${xn},${yn}`;
                    if (!map.has(nkey)) {
                        return;
                    }

                    if (!out.has(key)) {
                        out.set(key, new Set());
                    }

                    let set = out.get(key);

                    map.get(nkey).forEach(item => {
                        set.add(item);
                    });
                });
            }
        }

        return out;
    }

    function initial() {
        let out = new Map();

        for (let y = 0; y < ymax; y += 1) {
            for (let x = 0; x < xmax; x += 1) {
                let cell = Number(input[y][x]);
                let key = `${x},${y}`;

                if (cell === 9) {
                    let set = new Set();
                    set.add(key);
                    out.set(key, set);
                }
            }
        }

        return out;
    }

    let thing = initial();
    for (let i = 8; i >= 0; i -= 1) {
        thing = get(i, thing);
    }

    let sum = 0;

    thing.forEach(value => {
        sum += value.size;
    });

    console.log(sum);
}

function part2() {
    function n(x, y, fn) {
        fn(x + 1, y);
        fn(x - 1, y);
        fn(x, y + 1);
        fn(x, y - 1);
    }

    function get(which, map) {
        let out = new Map();

        for (let y = 0; y < ymax; y += 1) {
            for (let x = 0; x < xmax; x += 1) {
                let cell = Number(input[y][x]);

                if (cell !== which) {
                    continue;
                }

                let key = `${x},${y}`;
                let count = 0;

                n(x, y, (xn, yn) => {
                    let nkey = `${xn},${yn}`;
                    if (map.has(nkey)) {
                        count += map.get(nkey);
                    }
                });

                out.set(key, count);
            }
        }

        return out;
    }

    function initial() {
        let out = new Map();

        for (let y = 0; y < ymax; y += 1) {
            for (let x = 0; x < xmax; x += 1) {
                let cell = Number(input[y][x]);
                let key = `${x},${y}`;

                if (cell === 9) {
                    out.set(key, 1);
                } else {
                    out.set(key, 0);
                }
            }
        }

        return out;
    }

    let thing = initial();
    for (let i = 8; i >= 0; i -= 1) {
        thing = get(i, thing);
    }

    let sum = 0;

    thing.forEach(value => {
        sum += value;
    });

    console.log(sum);
}

part1();
part2();
