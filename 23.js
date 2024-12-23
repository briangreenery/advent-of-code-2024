const fs = require('fs');

let lines = fs.readFileSync('input.txt').toString().trim().split('\n');

function part1() {
    let edges = new Map();

    function addEdge(a, b) {
        let value = edges.get(a);
        if (value === undefined) {
            value = new Set();
            edges.set(a, value);
        }
        value.add(b);
    }

    lines.forEach(line => {
        let [a, b] = line.split('-');
        addEdge(a, b);
        addEdge(b, a);
    });

    let components = new Set();

    edges.forEach((edges1, node1) => {
        edges1.forEach(node2 => {
            edges.forEach((edges3, node3) => {
                if (edges3.has(node1) && edges3.has(node2)) {
                    if (node1.startsWith('t') || node2.startsWith('t') || node3.startsWith('t')) {
                        components.add([node1, node2, node3].sort().join(','));
                    }
                }
            });
        });
    });

    console.log(components.size);
}

function part2() {
    let edges = new Map();

    function addEdge(a, b) {
        let value = edges.get(a);
        if (value === undefined) {
            value = new Set();
            edges.set(a, value);
        }
        value.add(b);
    }

    lines.forEach(line => {
        let [a, b] = line.split('-');
        addEdge(a, b);
        addEdge(b, a);
    });

    let bestSize = 0;
    let best = null;

    edges.forEach((edges1, node1) => {
        let stronglyConnected = [[node1]];

        edges1.forEach(node2 => {
            let next = [];

            stronglyConnected.forEach(list => {
                let connected = [];

                list.forEach(node => {
                    if (edges.get(node2).has(node)) {
                        connected.push(node);
                    }
                });

                if (connected.length === list.length) {
                    list.push(node2);
                    next.push(list);
                } else {
                    connected.push(node2);
                    next.push(connected);
                    next.push(list);
                }
            });

            stronglyConnected.forEach(list => {
                if (list.length > bestSize) {
                    bestSize = list.length;
                    best = list;
                }
            });
        });
    });

    console.log(best.sort().join(','));
}

part1();
part2();
