function abcFromExp(exp) {
    let rgx = /([+-]?[^-+]+)/g;
    const ABC = {a: 0, b: 0, c: 0};

    let groups = [...exp.matchAll(rgx)].map(rgxRes => rgxRes[0]);

    groups.forEach((grp) => {
        let split = grp.split('*');
        let value = +split[0];

        if (!split[1] || split[1] === 'X^0')
            ABC.c += value;
        if ( split[1] === 'X' ||  split[1] === 'X^1')
            ABC.b += value;
        if ( split[1] === 'X^2')
            ABC.a += value;
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
        const i = Math.sqrt(delta * -1) / (2*ABC.a);
        console.log('Discriminant strictly negative, the two complexe solutions are:\n');
        console.log('* (-b + i * racine( |DELTA| )) / 2a   =>');
        console.log(`${r} + ${i}i\n`);
        console.log('* (-b - i * racine( |DELTA| )) / 2a   =>');
        console.log(`${r} - ${i}i\n`);
    }
    else if (delta === 0)
        console.log(`Discriminant is nul, the solution is:\n${ABC.b * -1 / (2 * ABC.a)}`);
    else if (delta > 0) {
        console.log('Discriminant strictly positive, the two solutions are:\n');
        console.log('* (-b - racine(Delta) ) / 2a   =>');
        console.log((ABC.b * -1 - Math.sqrt(delta)) / (2 * ABC.a));
        console.log('* (-b - racine(Delta) ) / 2a   =>');
        console.log((ABC.b * -1 + Math.sqrt(delta)) / (2 * ABC.a));
    }
}


(() => {
    let exp = process.argv[2].replace(/ /g, '').split('=');
    let ABC = getABC(exp);

    console.log(`\nReduced form: ${ABC.c} * X^0 ${ABC.b >= 0 ? '+ ' + ABC.b : '- ' + ABC.b * -1} * X^1 ${ABC.a >= 0 ? '+ ' + ABC.a : '- ' + ABC.a * -1} * X^2 = 0`);

    if (!ABC.a && !ABC.b ) return console.log(!ABC.c ? 'The group R (reals numbers) is solution' : 'Impossible');

    console.log(`* a: ${ABC.a}  b: ${ABC.b},  c: ${ABC.c}`);

    console.log(`Polynomial degree : ${ABC.a ? 2 : 1}`);

    if (!ABC.a) return console.log(`The solution is:\n${ABC.c / ABC.b * -1 }`);

    let delta = (ABC.b * ABC.b) - 4 * ABC.a * ABC.c;
    console.log('* Delta: = b²-4ac = ${delta}\n');

    printRes(ABC, delta);
})();
