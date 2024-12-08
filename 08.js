const fs = require('fs');

let map = fs.readFileSync('input.txt').toString().trim().split('\n').map(line => line.split(''));
let xmax = map[0].length;
let ymax = map.length;

let nodes = {};

for (let y = 0; y < ymax; y += 1) {
    for (let x = 0; x < xmax; x += 1) {
        let cell = map[y][x];

        if (cell === '.') {
            continue;
        }

        if (nodes[cell] === undefined) {
            nodes[cell] = [];
        }

        nodes[cell].push({ x, y });
    }
}

function ok(x, y) {
    return x >= 0 && x < xmax && y >= 0 && y < ymax;
}

let set = new Set();

Object.keys(nodes).forEach(key => {
    let list = nodes[key];

    for (let i = 0; i < list.length; i += 1) {
        let a = list[i];

        for (let j = i + 1; j < list.length; j += 1) {
            let b = list[j];

            for (let k = 0; k < 100; k += 1) {
                let xn = a.x - k * ( b.x - a.x );
                let yn = a.y - k * ( b.y - a.y );

                if (!ok(xn, yn)) {
                    break;
                }
                set.add(`${xn},${yn}`);
            }

            for (let k = 0; k < 100; k += 1) {
                let xn = b.x - k * ( a.x - b.x );
                let yn = b.y - k * ( a.y - b.y );

                if (!ok(xn, yn)) {
                    break;
                }
                set.add(`${xn},${yn}`);
            }
        }
    }
});

console.log(set.size);

// map.forEach(line => {
//     console.log(line.join(''));
// });
