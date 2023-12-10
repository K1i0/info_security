const rsa = require("../encryptionlib.js");
const mx = require("./matrix.js");
// Курсовая. Номер варианта: (16 % 3) + 1 = 2 (Гамильтонов цикл)
// Необходимо  написать  программу,  реализующую  протокол 
// доказательства с нулевым знанием для задачи «Гамильтонов цикл»

// 1) Элис и Боб знают некоторый граф G
// 2) Элис также знает гамильтонов цикл в этом графе
// 3) Боб об этом цикле не знает ничего и не имеет желания его искать, т.к.
// это ооочень долго (NP-полная задача)



function zeroKnowledgeProof() {
    let data = {p: 0, q: 0, n: 0, d: 0, phi: 0, c: 0};
    rsa.initialRSA(data, 4);

    let N = data.n;
    let d = data.d;

    // Граф G
    let matrix = new mx.Matrix(5, 5);
    matrix.readFormatMatrix();
    console.log('Source matrix: ');
    matrix.printMatrix();

    // ШАГ 1. Начало протокола
    // Алиса строит граф H, являющийся копией исходного графа
    // G, где у всех вершин новые, случайно выбранные номера
    let matrixH = new mx.Matrix(5, 5);
    matrixH.buildPermutation();
    console.log('\nIsomorph graph matrix: ');
    matrixH.printMatrix();

    matrixH.encodeMatrix();
    console.log('Matrix H after encoding: ');
    matrixH.printMatrix();

    // let matrixF = new mx.Matrix();
    // Зашифрованная матрица
    let matrixF = new mx.Matrix();
    matrixF.fillWithEncodeMatrix(5, matrixH.matrix, d, N);
    console.log('Matrix F: ');
    matrixF.printMatrix();

    /*
        Шаг 2. Боб, получив зашифрованный граф F , задает Алисе один
        из двух вопросов
        1. Каков гамильтонов цикл для графа H?
        2. Действительно ли граф H изоморфен G?
    */
    
    // Использую следующий: 
    // Каков гамильтонов цикл для графа H?


    // Шаг 3
    // Алиса расшифровывает в F ребра, образующие гамильтонов цикл
    matrixF.decryptEdgess()
}

// let a = 123545;
// let b = 0;

// console.log(binary(a));
// console.log(binary(b));
// console.log(binary(concatNumbers(a, b)));

// console.log(binary(11));

module.exports = {zeroKnowledgeProof}