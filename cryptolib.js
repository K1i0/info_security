// Бинарное возведение в степень по модулю
function cryptoPow(base, exp, mod) {
    let result = 1;
    if (exp === 0) {
        return 1;
    }
    while (exp) {
        if (exp & 1) {
            result = result * (base % mod);
            exp = exp - 1;
        } else {
            base = base * (base % mod);
            exp >>= 1
        }
    }
    return (result % mod);
}

//https://prog-cpp.ru/pow-mod/
// function cryptoPow(base, exp, mod) {
//     if (exp == 0) return 1;
//     let z = cryptoPow(base, Math.floor(exp / 2), mod);
//     if (exp % 2 == 0) {
//         return (z * z) % mod;
//     } else {
//         return ((base % mod) * ((z * z) % mod)) % mod;
//     }
// }

// let a = 5;
// let b = 11;
// let c = 3;
// console.log(cryptoPow(a, b, c));

// Расширенный алгоритм Евклида (НОД + коэффициенты)
function cryptoGCD(a, b, coef) {
    if (a == 0) {
        coef.x = 0;
        coef.y = 1;
        return b;
    }
    let coef1 = {x: 0, y: 0};
    let d = cryptoGCD(b % a, a, coef1);
    coef.x = coef1.y - (Math.trunc((b / a)) * coef1.x);
    coef.y = coef1.x;
    return d;
}

// let num1 = 35;
// let num2 = 67;
// let coef = {x: 0, y: 0};
// console.log(cryptoGCD(num1, num2, coef));
// console.log(coef.x);
// console.log(coef.y);

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}  

function isPrime(number) {
    if (number <= 1) {
        return false;
    }
    let sq = Math.sqrt(number);
    for (let index = 2; index <= sq; index++) {
        if (number % index == 0) {
            return false;
        }
    }
    return true;
}

function generatePrime() {
    let randNum;
    do {
        randNum = generateRandomNumber(1, 100);
    } while (!isPrime(randNum));
    return randNum;
}

function generateCommonKey() {
    // Простой модуль
    let p = generatePrime();
    console.log(`p: ${p}`);
    // База (генератор)
    let g = generatePrime();
    console.log(`g: ${g}`);

    // Приватная часть генерации общего ключа Элис
    let privateKeyAlice;
    do {
        privateKeyAlice = generateRandomNumber(1, 100)
    } while (privateKeyAlice >= p);
    console.log(`Alice private key: ${privateKeyAlice}`);
    // Приватная часть генерации общего ключа Боба
    let privateKeyBob;
    do {
        privateKeyBob = generateRandomNumber(1, 100)
    } while (privateKeyBob >= p);
    console.log(`Bob private key: ${privateKeyBob}`);

    // Ошибка в функции cryptoPow - возвращает числа больше модуля??????????
    let publicKeyAlice = cryptoPow(g, privateKeyAlice, p);
    console.log(`Alice public key: ${publicKeyAlice}`);
    let publicKeyBob = cryptoPow(g, privateKeyBob, p);
    console.log(`Bob public key: ${publicKeyBob}`);


    let commonKeyAlice = cryptoPow(publicKeyBob, privateKeyAlice, p);
    let commonKeyBob = cryptoPow(publicKeyAlice, privateKeyBob, p);

    console.log(commonKeyAlice);
    console.log(commonKeyBob);
}

generateCommonKey();

// console.log(isPrime(7));
// console.log(isPrime(12512));
// console.log(isPrime(3563412));
// console.log(generatePrime());
// console.log(generatePrime());