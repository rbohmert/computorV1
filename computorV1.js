function abcFromExp(exp) {
    let rgx = /([+-]?[^-+]+)/g;
    const ABC = {a: 0, b: 0, c: 0};

    let groups = [...exp.matchAll(rgx)].map(rgxRes => rgxRes[0]);

    groups.forEach((grp) => {
        // console.log(grp);
        let split = grp.split('*');
        let value = +split[0];

        if (isNaN(value) && !split[1])
        {
            value = split[0][0] === '-' ? -1 : 1;
            split[1] = split[0].slice(/[-+]/.test(split[0][0]) ? 1 : 0);
        }

        // console.log(`value: ${value}   split0: ${split[0]}    split1: ${split[1]}\n\n`);

        if (!split[1] || split[1] === 'X^0')
            ABC.c += value;
        else if ( split[1] === 'X' ||  split[1] === 'X^1')
            ABC.b += value;
        else if ( split[1] === 'X^2')
            ABC.a += value;
        else
            throw new Error('BUG');
    });

    return ABC;
}

function getABC(exp) {
    const ABC1 = abcFromExp(exp[0]);
    const ABC2 = abcFromExp(exp[1]);

    return {a: ABC1.a - ABC2.a, b: ABC1.b - ABC2.b, c: ABC1.c - ABC2.c,}
}


function printRes(ABC, delta) {
    if (delta < 0) {
        const r = ABC.b * -1 / (2 * ABC.a);
        const fractR = reduce(ABC.b * -1, 2 * ABC.a);
        const i = Math.sqrt(delta * -1) / (2*ABC.a);
        const fractI = reduce(Math.sqrt(delta * -1), 2 * ABC.a);

        console.log('Discriminant strictly negative, the two complexe solutions are:\n\n');
        console.log('* Solution1: (-b + i * racine( |DELTA| )) / 2a   =>\n');
        console.log(`${r} + ${i}i\n`);
        console.log(`* Or, with reduced fraction:\n*${fractR[0] + '/' + fractR[1]} + ${fractI[0] + '/' + fractI[1]}i\n\n`);
        console.log('* Solution2: (-b - i * racine( |DELTA| )) / 2a   =>\n');
        console.log(`${r} - ${i}i\n`);
        console.log(`* Or, with reduced fraction:\n* ${fractR[0] + '/' + fractR[1]} - ${fractI[0] + '/' + fractI[1]}i`);
    }
    else if (delta === 0) {
        const fract = reduce(ABC.b * -1, (2 * ABC.a));
        console.log(`Discriminant is nul, the solution is:\n${ABC.b * -1 / (2 * ABC.a)}`);
        console.log(`\n* Or, with reduced fraction:\n* ${fract[0] + '/' + fract[1]}`);
    }
    else if (delta > 0) {
        const fract1 = reduce((ABC.b * -1 - Math.sqrt(delta)), (2 * ABC.a));
        const fract2 = reduce((ABC.b * -1 + Math.sqrt(delta)), (2 * ABC.a));

        console.log('Discriminant strictly positive, the two solutions are:\n\n');
        console.log('*Solution1: (-b - racine(Delta) ) / 2a   =>\n');
        console.log((ABC.b * -1 - Math.sqrt(delta)) / (2 * ABC.a));
        console.log(`\n* Or, with reduced fraction:\n*${fract1[0] + '/' + fract1[1]}\n`);
        console.log('* (-b - racine(Delta) ) / 2a   =>');
        console.log((ABC.b * -1 + Math.sqrt(delta)) / (2 * ABC.a));
        console.log(`\n* Or, with reduced fraction:\n*${fract2[0] + '/' + fract2[1]}`)
    }
    printSep();
}

function sqrt(a) {
    let x;
    let x1 = a / 2;

    while (x !== x1) {
        x = x1;
        x1 = (x + (a / x)) / 2;
    }
    return x;
}

function reduce(numerator,denominator){
    var gcd = function gcd(a,b){
        return b ? gcd(b, a%b) : a;
    };
    gcd = gcd(numerator,denominator);
    return [numerator/gcd, denominator/gcd];
}

function printSep() {
    console.log('\n___________________________\n')
}

function minMax(ABC) {
    const alpha = ABC.b/(-2 * ABC.a);

    console.log(`Function f(x)= ${ABC.a}x² ${ABC.b >= 0 ? '+ ' + ABC.b : ABC.b}x ${ABC.b >= 0 ? '+ ' + ABC.c : ABC.c} is ${ABC.a > 0 ? "convex" : "concav"}:`);
    console.log(`f is strictly ${ABC.a > 0 ? "decreasing" : "increasing"} between ]-inf;${alpha}] and strictly ${ABC.a > 0 ? "increasing" : "decreasing"} between [${alpha};+inf[`);
    printSep();
}

(() => {
    console.log(process.argv);
    if (process.argv.length < 3 || process.argv.length > 3)
        return;

    let exp = process.argv[2].replace(/ /g, '').split('=');
    let ABC = getABC(exp);

    printSep();
    console.log(`Reduced form: ${ABC.c} ${ABC.b >= 0 ? '+ ' + ABC.b : '- ' + ABC.b * -1}*X^1 ${ABC.a >= 0 ? '+ ' + ABC.a : '- ' + ABC.a * -1}*X^2 = 0`);

    if (!ABC.a && !ABC.b ) return console.log(!ABC.c ? 'The group R (real numbers) is solution' : 'Impossible');

    console.log(`* a: ${ABC.a}  b: ${ABC.b},  c: ${ABC.c}`);

    console.log(`Polynomial degree : ${ABC.a ? 2 : 1}`);

    if (!ABC.a) {
        const fract = reduce(ABC.c, ABC.b * -1);
        console.log(`The solution is:\n${ABC.c / ABC.b * -1 }`);
        console.log(`\n* Or, with reduced fraction:\n*${fract[0] + '/' + fract[1]}`);
        return ;
    }

    let delta = (ABC.b * ABC.b) - 4 * ABC.a * ABC.c;
    console.log(`* Delta: = b²-4ac = ${delta}`);
    printSep();
    printRes(ABC, delta);
    minMax(ABC);
})();
