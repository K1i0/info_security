async function sha256(str) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str));
    return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
  }

//data - string, params={p: 0, q: 0, n: 0, d: 0, phi: 0, c: 0};
async function signatureRSA(data, params=undefined) {
    if (params === undefined) {
        params={p: 0, q: 0, n: 0, d: 0, phi: 0, c: 0};
        initialRSA(params, 5);
    }

    //Alice publishes N, d;
    let N = params.n;
    let d = params.d;

    //Secret c
    console.log(data);
    let y = JSON.stringify(await sha256(data));
    let str = '';
    for(let key in y){
        str += y[key];
    }
    y =str;
    console.log(`Y: ${str.substring(1, str.length - 1)}`);

    let byteY = new Uint8Array(y.length);

    for (let i = 0; i < y.length; i++) {
        byteY[i] = y[i].charCodeAt(0);
    }

    console.log(`ByteY (Y): ${byteY}`);

    let signature = new Uint32Array(byteY.length);
    let signatureString = '';
    //Signature hash result
    for (let i = 0; i < byteY.length; i++) {
        signature[i] = cryptoPow(byteY[i], params.c, N);
        // signatureString += String.fromCharCode(signature[i]);
    }

    console.log(`Byte array signature: ${signature}`);
    // console.log(`String signature: ${signatureString}`);


    //Check signature
    let deSign = new Uint8Array(signature.length);
    // let deSingString = '';

    for (let i = 0; i < signature.length; i++) {
        deSign[i] = cryptoPow(signature[i], d, N);
        // deSingString += String.fromCharCode(deSign[i]);
    }

    console.log(`Byte deSIGN (W): ${deSign}`);
    // console.log(`deSIGN: ${deSingString}`);
}