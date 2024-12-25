const fs = require('fs');

let [inputs, gatetexts] = fs.readFileSync('input.txt').toString().trim().split('\n\n');

let gates = gatetexts.split('\n').map(line => {
    let [left, op, right, _, out] = line.split(' ');
    return { left, op, right, out };
});

function part1() {
    let wires = new Map();
    inputs.split('\n').forEach(input => {
        let [name, value] = input.split(': ');
        wires.set(name, Number(value));
    });

    let done = false;

    while (!done) {
        done = true;

        gates.forEach(gate => {
            if (wires.get(gate.out) !== undefined) {
                return;
            }

            let left = wires.get(gate.left);
            let right = wires.get(gate.right);
            if (left === undefined || right === undefined) {
                return;
            }

            let out = 0;

            switch (gate.op) {
                case 'XOR':
                    out = left ^ right;
                    break;
                case 'OR':
                    out = left | right;
                    break;
                case 'AND':
                    out = left & right;
                    break;
                default:
                    console.log('wat');
                    process.exit(1);
            }

            wires.set(gate.out, out);
            done = false;
        });
    }

    let output = [];

    wires.forEach((value, name) => {
        if (name.startsWith('z')) {
            output.push({ name, value });
        }
    });

    output.sort((a, b) => a.name.localeCompare(b.name));
    output.reverse();
    console.log(parseInt(output.map(item => item.value).join(''), 2));
}

function part2() {
    function pad(n) {
        return (n < 10) ? ('0' + n) : n;
    }

    function x(n) {
        return `x${pad(n)}`;
    }

    function y(n) {
        return `y${pad(n)}`;
    }

    function z(n) {
        return `z${pad(n)}`;
    }

    function findOut(out) {
        for (let i = 0; i < gates.length; i += 1) {
            let gate = gates[i];

            if (gate.out === out) {
                return i;
            }
        }

        console.log(`missing ${a} ${op} ${b}`);
        process.exit(1);
    }

    function dieMsg(msg) {
        console.trace(msg);
        process.exit(1);
    }

    let swappedWires = [];

    function swapOutputs(out1, out2) {
        let index1 = findOut(out1);
        let index2 = findOut(out2);

        gates[index1].out = out2;
        gates[index2].out = out1;

        swappedWires.push(out1);
        swappedWires.push(out2);
    }

    function find(a, b, op) {
        for (let i = 0; i < gates.length; i += 1) {
            let gate = gates[i];

            if (gate.op !== op) {
                continue;
            }

            if (gate.left === a && gate.right === b) {
                return gate;
            }

            if (gate.left === b && gate.right === a) {
                return gate;
            }
        }

        dieMsg(`can't find ${a} ${op} ${b}`);
    }

    function formatGate(gate) {
        return `${gate.left} ${gate.op} ${gate.right} -> ${gate.out}`;
    }

    function xor(a, b) {
        return find(a, b, 'XOR');
    }

    function and(a, b) {
        return find(a, b, 'AND');
    }

    function or(a, b) {
        return find(a, b, 'OR');
    }

    swapOutputs('rkf', 'z09');
    swapOutputs('jgb', 'z20');
    swapOutputs('vcg', 'z24');
    swapOutputs('rvc', 'rrs');

    // x0 ^ y0 -> z0

    let gate0 = xor(x(0), y(0));
    if (gate0.out !== z(0)) {
        dieMsg(`${gate0.out} should be ${z(0)}`);
    }

    console.log(formatGate(gate0));
    console.log('');

    // (x1 ^ y1) ^ (x0 & y0) -> z1

    let in1 = xor(x(1), y(1));
    let carry1 = and(x(0), y(0));
    let out1 = xor(carry1.out, in1.out);
    if (out1.out !== z(1)) {
        dieMsg(`${out1.out} should be ${z(1)}`);
    }

    console.log(formatGate(in1));
    console.log(formatGate(carry1));
    console.log(formatGate(out1));
    console.log('');

    let carry2a = and(x(1), y(1));
    let carry2b = and(carry1.out, in1.out);
    let carry2c = or(carry2a.out, carry2b.out);
    console.log(formatGate(carry2a));
    console.log(formatGate(carry2b));
    console.log(formatGate(carry2c));

    let carryIn = carry2c;

    for (let i = 2; i < 45; i += 1) {
        let ini = xor(x(i), y(i));
        console.log(formatGate(ini));
        let outi = xor(carryIn.out, ini.out);
        console.log(formatGate(outi));
        if (outi.out !== z(i)) {
            dieMsg(`${outi.out} should be ${z(i)}`);
        }

        console.log('');

        let carry2a = and(x(i), y(i));
        console.log(formatGate(carry2a));
        let carry2b = and(carryIn.out, ini.out);
        console.log(formatGate(carry2b));
        carryIn = or(carry2a.out, carry2b.out);
        console.log(formatGate(carryIn));
    }

    swappedWires.sort();
    console.log(swappedWires.join(','));
}

part1();
part2();
