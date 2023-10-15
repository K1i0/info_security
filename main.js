// let a = 5;
// let b = 11;
// let c = 3;
// console.log(cryptoPow(a, b, c));


// let num1 = 35;
// let num2 = 67;
// let coef = {x: 0, y: 0};
// console.log(cryptoGCD(num1, num2, coef));
// console.log(coef.x);
// console.log(coef.y);

// console.log(isPrime(7));
// console.log(isPrime(12512));
// console.log(isPrime(3563412));

// generateCommonKey();

// console.log(`x: ${findL(351, 87, 541)}`);
// console.log(`x: ${findL(2, 3, 5)}`);
let data = {p: 23, ca: 7, da: 19, cb: 5, db: 9};
encryptionShamir(data);
console.log('/////////////////////////////////////////////////////////');
let data2 = {p: 23, g: 5, cb: 13, db: 21};
encryptionElgamal(data2, 15, 1);
console.log('/////////////////////////////////////////////////////////');
encryptionElgamal();
console.log('/////////////////////////////////////////////////////////');
encryptionVernam("hello", 5);
console.log('/////////////////////////////////////////////////////////');
encryptionRSA();