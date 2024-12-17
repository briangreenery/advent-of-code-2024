const fs = require('fs');

let [a, b] = fs.readFileSync('input.txt').toString().trim().split('\n\n');

let rinit = a.split('\n').map(line => Number(line.split(': ')[1]));
let program = b.split(': ')[1].split(',').map(Number);

function part1() {
    let r = rinit.slice();

    function loadCombo(n) {
        if (n <= 3) {
            return n;
        }
        return r[n - 4];
    }

    let ip = 0;
    let output = [];
    while (ip < program.length) {
        let instruction = program[ip];

        switch (instruction) {
            case 0: // adv
                r[0] = Math.floor(r[0] / Math.pow(2, loadCombo(program[ip + 1])));
                break;
            case 1: // bxl
                r[1] ^= program[ip + 1];
                break;
            case 2: // bst
                r[1] = loadCombo(program[ip + 1]) % 8;
                break;
            case 3: // jnz
                if (r[0] !== 0) {
                    ip = program[ip + 1];
                    continue;
                }
                break;
            case 4: // bxc
                r[1] ^= r[2];
                break;
            case 5: // out
                output.push(loadCombo(program[ip + 1]) % 8);
                break;
            case 6: // bdv
                r[1] = Math.floor(r[0] / Math.pow(2, loadCombo(program[ip + 1])));
                break;
            case 7: // cdv
                r[2] = Math.floor(r[0] / Math.pow(2, loadCombo(program[ip + 1])));
                break;
        }

        ip += 2;
    }

    console.log(output.join(','));
}

function part2() {
    function run(A) {

        let out = []
        let B = 0;
        let C = 0;
    
        while (true) {
            B = A % 8;   // last 3 bits
            B ^= 5;      // 101
            C = Math.floor(A / (2 ** B)); // anywhere in the last 8 bits to next 8 bits
            B ^= 6;      // 110 -> b ^ 11
            A = Math.floor(A / 8); // remove 8 bits
            B = B % 8;
            B ^= (C%8);      //  -> b = (last 3 bits of a) ^ (011) ^ (a >> (a ^ 5))
            out.push(B % 8);
    
            if (A == 0) {
                break;
            }
        }
    
        return out;
    }
    
    const target = program.slice();
    target.reverse();
    
    let best = Infinity;
    
    function search(sofar, i) {
        if (i === target.length) {
            best = Math.min(best, sofar);
            return true;
        }
    
        let targetDigit = target[i];
    
        for (let n = 0; n < 8; n += 1) {
            let maybe = (sofar * 8) + n;
    
            let result = run(maybe);
    
            if (result[0] !== targetDigit) {
                continue;
            }
            if (search(maybe, i + 1)) {
                return;
            }
        }
    
        return false;
    }
    
    search(0, 0);
    console.log(best);
}

part1();
part2();
