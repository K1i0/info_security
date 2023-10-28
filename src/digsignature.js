async function sha256(str) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str));
    return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
}

async function hashData(string_data) {
    let hash = await sha256(string_data).then(result => {return result;}); //  Возвращаем при помощи then результат, а не объект
    let string_hash = '';
    for(let key in hash){
        string_hash += hash[key];
    }
    return string_hash;
}

//data - string, params={p: 0, q: 0, n: 0, d: 0, phi: 0, c: 0};
async function signatureRSA(data, params=undefined) {
    console.log('////////////////////////////RSA DIGIT SIGNATURE///////////////////////////////////////////////');
    if (params === undefined) {
        params={p: 0, q: 0, n: 0, d: 0, phi: 0, c: 0};
        initialRSA(params);
    }

    //Alice publishes N, d;
    let N = params.n;
    let d = params.d;

    //Secret c
    let secretC = params.c;

    //Log source message
    console.log('Data: ' + data);

    //Get message hash
    let hash = await hashData(data);
    console.log(`Hash (Y): ${hash}`);

    //Turn string hash into byte array
    let byteHash = [];
    for (let sym in hash) {
        byteHash.push(hash[sym].charCodeAt(0));
    }
    console.log(`ByteHash (Y): ${byteHash}`);

    // //Signature hash result
    let signature = [];
    for (let sign_key in byteHash) {
        signature.push(cryptoPow(byteHash[sign_key], secretC, N));
    }
    console.log(`Byte array signature: ${signature}`);

    //Check signature
    let deSign =[];
    let deSignString = '';
    for (let sign_key in signature) {
        deSign.push(cryptoPow(signature[sign_key], d, N));
        deSignString += String.fromCharCode(cryptoPow(signature[sign_key], d, N));
    }
    console.log(`Byte deSIGN (W): ${deSign}`);
    console.log(`deSIGN: ${deSignString}`);
    console.log('///////////////////////////////////////////////////////////////////////////');
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function signatureElgamalGenK(p, ord) {
    let k;
    do {
        k = generateBigRandomNumber(ord);
    } while (!(k > 1 && k < p - 1) || !(cryptoGCD(p-1, k) === 1));
    return k;
}

function signatureElgamalGenReverseK(k, phi) {
    let coef_k = {x: 0, y: 0};
    cryptoGCD(k, phi, coef_k);
    return coef_k.x > 0 ? coef_k.x : coef_k.x + phi;
}

//ord > 2
async function signatureElgamal(data, params=undefined, ord=5)  {
    console.log('////////////////////////////ELGAMAL DIGIT SIGNATURE///////////////////////////////////////////////');
    //Public params
    let openParamsPQ = encryptionElgamalGenP(ord);
    let g = encryptionElgamalGenG(data.p, openParamsPQ.q, ord);
    
    //PRIVATE key
    let x = encryptionElgamalGenC(openParamsPQ.p, ord);

    //PUBLIC key
    let y = cryptoPow(g, x, openParamsPQ.p);

    //1 < h(m) < p
    let hashString = await hashData(data);
    console.log(`Hash (string): ${hashString}`);

    let hashByte = [];
    for (let sym in hashString) {
        hashByte.push(hashString[sym].charCodeAt(0));
    }

    //1 < k < p - 1, cryptoGCD(p-1, k) === 1
    let k = signatureElgamalGenK(openParamsPQ.p, ord);

    let r = cryptoPow(g, k, openParamsPQ.p);

    let u = [];
    for (let i = 0; i < hashByte.length; i++) {
        if (hashByte[i] - (x * r) < 0) {
            u.push((openParamsPQ.p - 1) - cryptoPow(Math.abs(hashByte[i] - x * r), 1, openParamsPQ.p - 1));
        } else {
            u.push(cryptoPow(hashByte[i] - x * r, 1, openParamsPQ.p - 1));
        }
    }

    let reverseK = signatureElgamalGenReverseK(k, openParamsPQ.p - 1);

    let s = [];
    for (let u_key in u) {
        s.push(cryptoPow(reverseK * u[u_key], 1, openParamsPQ.p - 1))
    }

    //signature <message; r, s>
    console.log(`Signature <message; r, s>:`);
    console.log(`<${data}; ${r}, ${s}>`);


    //Check signature
    let partA = [];
    let partB = [];

    for (let index in s) {
        partA.push(cryptoPow(cryptoPow(y, r, openParamsPQ.p) * cryptoPow(r, s[index], openParamsPQ.p), 1, openParamsPQ.p));
        partB.push(cryptoPow(g, hashByte[index], openParamsPQ.p));
    }
    console.log(`Part A: ${partA}`);
    console.log(`Part B: ${partB}`);
    
    let statusSignCheck = JSON.stringify(partA) === JSON.stringify(partB);
    console.log(`Signature check status: ${statusSignCheck}`);
    console.log('///////////////////////////////////////////////////////////////////////////');
}