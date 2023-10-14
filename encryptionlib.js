function encryptionGenP(ord=8) {
    let p;
    do {
        let q = generateBigPrime(ord);
        p = 2 * q + 1;
    } while (!(isPrime(p)));
    return p;
}

function encryptionGenC(p, ord=8) {
    let c;
    do {
        c = generateBigRandomNumber(5);
    } while ((c >= p) || (cryptoGCD(p-1, c) !== 1));
    return c;
}



function encryptionShamir() {
    //A generate big simple p
    let p = encryptionGenP(5);
    console.log(`Public P: ${p}`);

    let ca = encryptionGenC(p, 5);
    console.log(`Secret CA: ${ca}`);

    let da;
    let coef_da = {x: 0, y: 0};
    cryptoGCD(ca, p - 1, coef_da);
    da = coef_da.x > 0 ? coef_da.x : coef_da.x + p - 1;
    console.log(`Secret DA: ${da}`);

    let cb = encryptionGenC(p, 5);
    console.log(`Secret CB: ${cb}`);

    let db;
    let coef_db = {x: 0, y: 0};
    cryptoGCD(cb, p - 1, coef_db);
    db = coef_db.x > 0 ? coef_db.x : coef_db.x + p - 1;
    console.log(`Secret DB: ${db}`);


    let message = 105;
    if (message < p) {
        console.log(message);
        //Shamir protocol
        let x1 = cryptoPow(message, ca, p);
        console.log(`X1 (A -> B): ${x1}`);

        let x2 = cryptoPow(x1, cb, p);
        console.log(`X2 (B -> A): ${x2}`);

        let x3 = cryptoPow(x2, da, p);
        console.log(`X3 (A -> B): ${x3}`);

        let x4 = cryptoPow(x3, db, p);
        console.log(`X4 (decoded): ${x4}`);
    } else {
        /*
            В настоящее время такой шифр, как правило, используется для пере-
            дачи чисел, например, секретных ключей, значения которых меньше
            p. Таким образом, мы будем рассматривать только случай m < p.
        */
    }
}