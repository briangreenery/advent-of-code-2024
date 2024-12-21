const fs = require('fs');

const input = fs.readFileSync('input.txt').toString().trim().split('\n')

const keypad1 = {
    7: [0, 0],
    8: [1, 0],
    9: [2, 0],
    4: [0, 1],
    5: [1, 1],
    6: [2, 1],
    1: [0, 2],
    2: [1, 2],
    3: [2, 2],
    0: [1, 3],
    'A': [2, 3],
};

const keypad2 = {
    '^': [1, 0],
    'A': [2, 0],
    '<': [0, 1],
    'v': [1, 1],
    '>': [2, 1],
};

const controls1 = {
    keypad: keypad1,
    bad: { x: 0, y: 3 },
};

const controls2 = {
    keypad: keypad2,
    bad: { x: 0, y: 0 },
};

function paths(controls, sofar, x1, y1, x2, y2, f) {
    if (x1 === controls.bad.x && y1 === controls.bad.y) {
        return;
    }

    if (x1 === x2 && y1 === y2) {
        f(sofar);
        return;
    }

    if (x2 > x1) {
        sofar.push('>');
        paths(controls, sofar, x1 + 1, y1, x2, y2, f);
        sofar.pop();
    } else if (x2 < x1) {
        sofar.push('<');
        paths(controls, sofar, x1 - 1, y1, x2, y2, f);
        sofar.pop();
    }

    if (y2 > y1) {
        sofar.push('v');
        paths(controls, sofar, x1, y1 + 1, x2, y2, f);
        sofar.pop();
    } else if (y2 < y1) {
        sofar.push('^');
        paths(controls, sofar, x1, y1 - 1, x2, y2, f);
        sofar.pop();
    }
}

function okChild(x, y) {
    return !(x === 0 && y === 3);
}

function okParent(x, y) {
    return !(x === 0 && y === 0);
}

function solve(inputPath, parentCount) {
    let parents = [];
    for (let i = 0; i < parentCount; i += 1) {
        parents.push('A');
    }

    let pos = 'A';
    let memo = new Map();

    function makeMemoKey(parents, key) {
        let parts = [];
        parts.push(key);
        parts.push('@');
        parents.forEach(parent => parts.push(parent));
        return parts.join('');
    }

    function getMoveCount(parents, key) {
        if (parents.length === 0) {
            return { count: 1, state: [] };
        }

        const pos = parents[parents.length - 1];

        let [x1, y1] = keypad2[pos];
        const [x2, y2] = keypad2[key];

        const memoKey = makeMemoKey(parents, key);
        const cached = memo.get(memoKey);
        if (cached !== undefined) {
            return { count: cached.count, state: cached.state.slice() };
        }

        const dx = Math.sign(x2 - x1);
        const dy = Math.sign(y2 - y1);

        const xdir = x2 > x1 ? '>' : '<';
        const ydir = y2 > y1 ? 'v' : '^';

        let best = Infinity;
        let bestParents = null;

        paths(controls2, [], x1, y1, x2, y2, (path) => {
            let grandparents = parents.slice(0, -1);
            let total = 0;
            path.push('A');
            path.forEach(key => {
                let state = getMoveCount(grandparents, key);
                total += state.count;
                grandparents = state.state;
            });
            path.pop();

            if (total < best) {
                best = total;
                bestParents = grandparents;
            }
        });

        bestParents.push(key);
        memo.set(memoKey, { count: best, state: bestParents });
        return { count: best, state: bestParents.slice() };
    }

    let solution = 0;

    inputPath.split('').forEach(key => {
        let [x1, y1] = keypad1[pos];
        const [x2, y2] = keypad1[key];

        const dx = Math.sign(x2 - x1);
        const dy = Math.sign(y2 - y1);

        const xdir = x2 > x1 ? '>' : '<';
        const ydir = y2 > y1 ? 'v' : '^';

        let best = Infinity;
        let bestParents = null;

        paths(controls1, [], x1, y1, x2, y2, (path) => {
            let localParents = parents.slice();
            let total = 0;
            path.push('A');
            path.forEach(key => {
                let state = getMoveCount(localParents, key);
                total += state.count;
                localParents = state.state;
            });
            path.pop();

            if (total < best) {
                best = total;
                bestParents = localParents;
            }
        });

        solution += best;
        parents = bestParents;

        pos = key;
    });

    return solution;
}

let sum1 = 0;
let sum2 = 0;

input.forEach(keys => {
    let number = Number(keys.substring(0, 3));
    sum1 += number * solve(keys, 2);
    sum2 += number * solve(keys, 25);
});

console.log(sum1);
console.log(sum2);
