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
            base = base * base
            exp >>= 1
        }
    }
    return result;
}

let a = 5;
let b = 11;
let c = 3;
console.log(cryptoPow(a, b, c));

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

let num1 = 35;
let num2 = 67;
let coef = {x: 0, y: 0};
console.log(cryptoGCD(num1, num2, coef));
console.log(coef.x);
console.log(coef.y);