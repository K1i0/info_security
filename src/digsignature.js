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
}