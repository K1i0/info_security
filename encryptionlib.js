function encryptionGenP(ord=8) {
    let p;
    do {
        let q = generateBigPrime(ord);
        p = 2 * q + 1;
    } while (!(isPrime(p)));
    return p;
}

function encryptionShamirGenC(p, ord=8) {
    let c;
    do {
        c = generateBigRandomNumber(ord);
    } while ((c >= p) || (cryptoGCD(p-1, c) !== 1));
    return c;
}

function encryptionShamirGenD(c, p) {
    let coef_d = {x: 0, y: 0};
    cryptoGCD(c, p - 1, coef_d);
    return coef_d.x > 0 ? coef_d.x : coef_d.x + p - 1;
}


function encryptionShamir(data = undefined, message=10) {
    if (data === undefined) {
        data = {p: 0, ca: 0, da: 0, cb: 0, db: 0};
        //A generate big simple p
        data.p = encryptionGenP(5);
        console.log(`Public P: ${data.p}`);

        data.ca = encryptionShamirGenC(data.p, 5);
        console.log(`Secret CA: ${data.ca}`);

        data.da = encryptionShamirGenD(data.ca, data.p);
        console.log(`Secret DA: ${data.da}`);

        data.cb = encryptionShamirGenC(data.p, 5);
        console.log(`Secret CB: ${data.cb}`);

        data.db = encryptionShamirGenD(data.cb, data.p);
        console.log(`Secret DB: ${data.db}`);
    }

    if (message < data.p) {
        console.log(`Source message: ${message}`);
        //Shamir protocol
        let x1 = cryptoPow(message, data.ca, data.p);
        console.log(`X1 (A -> B): ${x1}`);

        let x2 = cryptoPow(x1, data.cb, data.p);
        console.log(`X2 (B -> A): ${x2}`);

        let x3 = cryptoPow(x2, data.da, data.p);
        console.log(`X3 (A -> B): ${x3}`);

        let x4 = cryptoPow(x3, data.db, data.p);
        console.log(`X4 (decoded): ${x4}`);
    } else {
        /*
            В настоящее время такой шифр, как правило, используется для пере-
            дачи чисел, например, секретных ключей, значения которых меньше
            p. Таким образом, мы будем рассматривать только случай m < p.
        */
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function encryptionElgamalGenP(ord=8) {
    let p;
    let q;
    do {
        q = generateBigPrime(ord);
        p = 2 * q + 1;
    } while (!(isPrime(p)));
    return {p, q};
}

function encryptionElgamalGenG(p, q, ord=5) {
    let g;
    do {
        g = generateBigPrime(ord);
    } while (!(g > 1 && g < p - 1) && cryptoPow(g, q, p) === 1);
    return g;
}

function encryptionElgamalGenC(p, ord) {
    let c;
    do {
        c = generateBigRandomNumber(ord);
    } while (!(c > 1 && c < p - 1));
    return c;
}

//data: p, g, recipientOpenKey (db)
//returns encoded data for send
function encodeElgamal(message, p, g, recipientOpenKey, ord=5) {
    let k;
    do {
        k = generateBigRandomNumber(ord);
    } while (!(k >= 1 && k <= p - 2));
    console.log(`Public K(A): ${k}`);

    let r = cryptoPow(g, k, p);
    console.log(`Public R(A): ${r}`);

    let e = cryptoPow(message * cryptoPow(recipientOpenKey, k, p), 1,  p);
    console.log(`Public E(A): ${e}`);
    return {r, e};
}

//encodedData (r, e), p, recepientPrivateKey (cb)
//returns decoded message
function decodeElgamal(encodedData, p, recipientPrivateKey) {
    return cryptoPow(
           encodedData.e * cryptoPow(encodedData.r, p - 1 - recipientPrivateKey, p), 1, p
        );
}

function encryptionElgamal(data = undefined, message=10, ord=5) {
    if (data === undefined) {
        data = {p: 0, g: 0, cb: 0, db: 0};

        let openParamsPQ = encryptionElgamalGenP(ord);
        data.p = openParamsPQ.p;

        //g - general key
        data.g = encryptionElgamalGenG(data.p, openParamsPQ.q, ord);
        console.log(`g: ${data.g}`);

        //Пропустил генерацию параметров c, d для абонента А

        //c - private key
        data.cb = encryptionElgamalGenC(data.p, ord);
        console.log(`Private C2: ${data.cb}`);

        //d - common key
        data.db = cryptoPow(data.g, data.cb, data.p);
        console.log(`Public D2: ${data.db}`);
    }
    

    if (message < data.p) {
        console.log(`Source message: ${message}`);
        //A generate k, r, e (encrypt)
        let encodedParams = encodeElgamal(message, data.p, data.g, data.db, ord);
        //B decodes message
        let decoded_message = decodeElgamal(encodedParams, data.p, data.cb);
        console.log(`Decoded message (B)): ${decoded_message}`);
    } else {
        /*
            В настоящее время такой шифр, как правило, используется для пере-
            дачи чисел, например, секретных ключей, значения которых меньше
            p. Таким образом, мы будем рассматривать только случай m < p.
        */
    }
}

// m ^ k -> e
// e ^ k -> m
//value - string
function encryptionVernam(message, k) {
    let byteArray = new Uint8Array(message.length);

    for (let i = 0; i < message.length; i++) {
        byteArray[i] = message[i].charCodeAt(0) ^ k;
        console.log(byteArray[i]);
    }

    for (let i = 0; i < message.length; i++) {
        console.log(String.fromCharCode(byteArray[i] ^ k));
    }

    return byteArray;
}


//////////////////////////////////////////////////////////////////////
function encryptionRSArGenD(phi, ord=8) {
    let d;
    do {
        d = generateBigRandomNumber(ord);
    } while (!(d < phi) || !(cryptoGCD(phi, d) === 1));
    return d;
}

function encryptionRSAGenC(d, phi) {
    let coef_c = {x: 0, y: 0};
    cryptoGCD(d, phi, coef_c);
    return coef_c.x > 0 ? coef_c.x : coef_c.x + phi - 1;
}

function encryptionRSA(data=undefined, message=10, ord=5) {
    // if (data === undefined) {
    //     data = {p: 0, q: 0, n: 0, d: 0};
    //     //PARAMS B//////////////////////
    //     //phi = (P-1)*(Q-1)
    //     let P = encryptionGenP(ord);
    //     console.log(`P: ${P}`);
    //     let Q = encryptionGenP(ord); //just use GenP to generate big prime number
    //     console.log(`Q: ${Q}`);
        
    //     //Public N
    //     let N = P * Q;
    //     console.log(`N: ${N}`);

    //     let Phi = (P - 1) * (Q - 1);
    //     console.log(`Phi: ${Phi}`);

    //     // let d = encryptionRSArGenD(Phi, 5);
    //     // console.log(`db: ${d}`);

    //     // //private
    //     // let c = encryptionRSAGenC(d, Phi);
    //     // console.log(`cb: ${c}`);
    //     // //PARAMS B//////////////////////
    // }
    data = {p: 3, q: 11, n: 33, d: 3};
    let Phi = (data.p - 1) * (data.q - 1);
    console.log(`Phi: ${Phi}`);

    let c = encryptionRSAGenC(data.d, Phi);
    console.log(`cb: ${c}`);

    if (message < data.n) {
        console.log(`Source message: ${message}`);
        //A generate k, r, e (encrypt)
        let e = cryptoPow(message, data.d, data.n);
        //B decodes message
        let decoded_message = cryptoPow(e, c, data.n);
        console.log(`Decoded message (B)): ${decoded_message}`);
    } else {
        /*
            В настоящее время такой шифр, как правило, используется для пере-
            дачи чисел, например, секретных ключей, значения которых меньше
            p. Таким образом, мы будем рассматривать только случай m < p.
        */
    }
}