// Бинарное возведение в степень по модулю
function cryptoPow(base, exp, mod) {
    let result = 1;
    if (exp === 0) {
        return 1;
    }
    while (exp) {
        if (exp & 1) {
            result = (result * base) % mod;
            exp = exp - 1;
        } else {
            base = (base * base) % mod;
            exp >>= 1
        }
    }
    return (result % mod);
}

// Расширенный алгоритм Евклида (НОД + коэффициенты)
function cryptoGCD(a, b, coef = {x: 0, y: 0}) {
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

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}  

function generateBigRandomNumber(ord=8) {
    return Math.floor(Math.random() * (10 ** ord - 10**(ord-1)) + 10**(ord-1))
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

function generateBigPrime(ord=8) {
    let randNum;
    do {
        randNum = generateBigRandomNumber(ord);
    } while (!isPrime(randNum));
    return randNum;
}

function generateCommonKey(p = undefined, g = undefined, privateKeyAlice = undefined, privateKeyBob = undefined) {
    
    if (p === undefined || g === undefined || privateKeyAlice === undefined || privateKeyBob === undefined) {
        alert('Input parameters (all) regeneration!');
        // Простой модуль
        // p = generateBigPrime();
        // p = generatePrime();
        do {
            let q = generateBigPrime();
            p = 2*q+1;
            // p = generatePrime();
        } while (!(isPrime(p)));
        console.log(`p: ${p}`);

        // База (генератор)
        // g = generatePrime();
        // g = generateBigPrime();
        // g = generatePrime()
        do {
            g = generateBigPrime();
            // g = generatePrime()
        } while (g >= p && cryptoPow(g,q,p) != 1);
        console.log(`g: ${g}`);

        // Приватная часть генерации общего ключа Элис
        do {
            // privateKeyAlice = generateRandomNumber(1, 100)
            privateKeyAlice = generateRandomNumber(1, 10);
        } while (privateKeyAlice >= p);
        console.log(`Alice private key: ${privateKeyAlice}`);
        // Приватная часть генерации общего ключа Боба
        do {
            // privateKeyBob = generateRandomNumber(1, 100);
            privateKeyBob = generateRandomNumber(1, 10)
        } while (privateKeyBob >= p);
        console.log(`Bob private key: ${privateKeyBob}`);
    } else if (!(g < p) || !isPrime(g) || !isPrime(p)) {
        alert('Input parameters (g, p) regeneration!');
        // p = generatePrime();
        p = generateBigPrime();
        do {
            // p = generatePrime();
            p = generateBigPrime();
        } while (!(p > 1));
        console.log(`p: ${p}`);

        // База (генератор)
        // g = generatePrime();
        g = generateBigPrime();
        do {
            // g = generatePrime();
            g = generateBigPrime();
        } while (g >= p);
        console.log(`g: ${g}`);
    }

    let publicKeyAlice = cryptoPow(g, privateKeyAlice, p);
    console.log(`Alice public key: ${publicKeyAlice}`);
    let publicKeyBob = cryptoPow(g, privateKeyBob, p);
    console.log(`Bob public key: ${publicKeyBob}`);

    let commonKeyAlice = cryptoPow(publicKeyBob, privateKeyAlice, p);
    let commonKeyBob = cryptoPow(publicKeyAlice, privateKeyBob, p);

    console.log(`Generated common key (Alice): ${commonKeyAlice}`);
    console.log(`Generated common key (Bob): ${commonKeyBob}`);
    let aaa = findL(commonKeyAlice, g, p);
    console.log(`g: ${g}, p: ${p}, CA: ${commonKeyAlice} , x: ${aaa}`);
}

// Вспомогательная функция - быстрый поиск совпадений
function cryptoFindEqual(u, v, m) {
    let map = new Map();
    for (let i = 1; i <= m; i++) {
        map.set(u[i - 1], i); //Исходные индексы нумеровались с 1, поэтому значения + 1
    }
    for (let j = 1; j <= m; j++) {
        if (map.has(v[j - 1])) {
            return [map.get(v[j - 1]), j];
        }
    }
    return [0, 0];
}

// a = g^x (mod p), find x
// Вычисление дискретного логарифма
function findL(a, g, p) {
    let m = Math.ceil(Math.sqrt(p));
    console.log(`a: ${a}, g: ${g}, p: ${p}, m: ${m}`);
    let u = [];
    let v = [];
    for (let i = 1; i <= m; i++) {
        v.push(cryptoPow(cryptoPow(g, 1, p) * cryptoPow(a, i, p), 1, p));
        u.push(cryptoPow(a, i * m, p));
    }

    let ij = cryptoFindEqual(u, v, m);
    let x = cryptoPow(m * ij[0] - ij[1], 1, p - 1);
    return x;
}