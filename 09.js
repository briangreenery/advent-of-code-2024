const fs = require('fs');

let input = fs.readFileSync('input.txt').toString().trim().split('').map(Number);

function part1() {
    let data = [];

    for (let i = 0; i < input.length; i += 1) {
        let size = input[i];

        for (let j = 0; j < size; j += 1) {
            if (i % 2 === 0) {
                data.push(i / 2);
            } else {
                data.push(-1);
            }
        }
    }

    let a = 0;
    let b = data.length - 1;

    while (a < b) {
        if (data[a] >= 0) {
            a += 1;
            continue;
        }

        if (data[b] === -1) {
            b -= 1;
            continue;
        }

        data[a] = data[b];
        data[b] = -1;
        a += 1;
        b -= 1;
    }

    while (a < data.length && data[a] >= 0) {
        a += 1;
    }

    let sum = 0;

    for (let i = 0; i < a; i += 1) {
        sum += i * data[i];
    }

    console.log(sum);
}

function part2() {
    let used = {};
    let free = [];

    let start = 0;

    for (let i = 0; i < input.length; i += 1) {
        let size = input[i];

        if (i % 2 === 0) {
            if (used[size] === undefined) {
                used[size] = [];
            }

            used[size].push({ start, id: i / 2, size });
        } else {
            free.push({ start, size });
        }

        start += size;
    }

    let moved = [];

    free.forEach(block => {
        let start = block.start;
        let size = block.size;

        while (size > 0) {
            let choice = null;

            for (let i = 1; i <= size; i += 1) {
                let bucket = used[i];
                if (bucket === undefined || bucket.length === 0) {
                    continue;
                }

                let a = bucket[bucket.length - 1];
                if (a.start < start) {
                    continue;
                }

                if (choice === null) {
                    choice = bucket;
                    continue;
                }

                let b = choice[choice.length - 1];

                if (a.id > b.id) {
                    choice = bucket;
                }
            }

            if (choice === null) {
                break;
            }

            let thing = choice.pop();

            thing.start = start;
            moved.push(thing);

            size -= thing.size;
            start += thing.size;
        }
    });

    let sum = 0;

    Object.keys(used).forEach(key => {
        used[key].forEach(block => {

            for (let i = 0; i < block.size; i += 1) {
                sum += (block.start + i) * block.id;
            }
        });
    });

    Object.keys(moved).forEach(key => {
        let block = moved[key];

        for (let i = 0; i < block.size; i += 1) {
            sum += (block.start + i) * block.id;
        }
    });

    console.log(sum);
}

part1();
part2();
