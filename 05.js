const fs = require('fs');

let [rules, lines] = fs.readFileSync('input.txt').toString().trim().split('\n\n').map(part => part.split('\n'));

function isSorted(pages) {
    for (let i = 0; i < pages.length; i += 1) {
        for (let j = i + 1; j < pages.length; j += 1) {
            if (rules.indexOf(`${pages[j]}|${pages[i]}`) !== -1) {
                return false;
            }
        }
    }
    return true;
}

let repeat = [];

lines.forEach(line => {
    let pages = line.split(',').map(Number);

    if (!isSorted(pages)) {
        repeat.push(pages);
    }
});

let sum = 0;

repeat.forEach(pages => {
    pages.sort((a, b) => {
        if (rules.indexOf(`${a}|${b}`) !== -1) {
            return -1;
        }

        if (rules.indexOf(`${b}|${a}`) !== -1) {
            return 1;
        }

        process.exit(1);
        return 0;
    });

    sum += pages[Math.floor(pages.length / 2)];
});

console.log(sum);
