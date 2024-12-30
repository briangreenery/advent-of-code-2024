const fs = require('fs');

let graphs = fs.readFileSync('input.txt').toString().trim().split('\n\n').map(g => g.split('\n'));
const xlen = graphs[0][0].length;
const ylen = graphs[0].length;

let keys = [];
let locks = [];

graphs.forEach(graph => {
    let xlen = graph[0].length;
    let ylen = graph.length;

    let heights = [];

    for (let x = 0; x < xlen; x += 1) {
        let height = 0;
        if (graph[0][x] === '#') {
            for (let y = 1; y < ylen; y += 1) {
                if (graph[y][x] === '#') {
                    height += 1;
                } else {
                    break;
                }
            }
        } else {
            for (let y = ylen - 2; y >= 0; y -= 1) {
                if (graph[y][x] === '#') {
                    height += 1;
                } else {
                    break;
                }
            }
        }
        heights.push(height);
    }

    if (graph[0][0] === '#') {
        locks.push(heights);
    } else {
        keys.push(heights);
    }
});

let sum = 0;

locks.forEach(lock => {
    keys.forEach(key => {
        for (let x = 0; x < xlen; x += 1) {
            if (lock[x] + key[x] > ylen - 2) {
                return;
            }
        }

        sum += 1;
    });
});

console.log(sum);
