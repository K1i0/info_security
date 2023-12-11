const rsa = require("../encryptionlib.js");
const mx = require("./matrix.js");
const crpt = require('../cryptolib.js');
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

    //public key
    let N = data.n;
    let d = data.d;
    //private key
    let c = data.c;

    console.log(`N: ${N}, d: ${d}, c: ${data.c}\n`);

    let stepCount = 3; // Количество итераций повторений протокола
    let questionNum = mx.getRandomNumber(0, 1);
    let isVerified = true;

    // Граф G
    let matrixG = new mx.Matrix(5, 5);
    matrixG.readFormatMatrix();
    matrixG.readPath();
    console.log('Source matrix: ');
    matrixG.printMatrix();
    
    for (let t = 0; t < stepCount; t++) {
        // Алиса строит граф H, являющийся копией исходного графа
        // G, где у всех вершин новые, случайно выбранные номера
        let matrixH = new mx.Matrix(5, 5);
        // matrixH.buildPermutation();
        let shuffle = matrixH.initShuffle(matrixG);
        console.log('\nShuffle: ' + JSON.stringify(shuffle));
        console.log('\nIsomorph graph matrix: ');
        matrixH.printMatrix();

        matrixH.encodeMatrix();
        console.log('\nMatrix H after encoding: ');
        matrixH.printMatrix();
        console.log('\n')

        // Зашифрованная матрица
        let matrixF = new mx.Matrix(5, 5);
        matrixF.copyMatrix(matrixH);
        matrixF.encryptMatrix(d, N);

    
        switch (questionNum) {
            case 0:
                console.log(`Выбран вопрос: 1. Каков гамильтонов цикл для графа H?`);
                console.log('\nMatrix F: ');
                matrixF.printMatrix();
                // Расшифровка в F ребер, образующих Гамильтонов цикл
                let transcriptions = matrixF.decryptEdgess(matrixG.hamPath, shuffle, c, N);
                // Проверка расшифровки, путем повторного шифрования и сравнения с F
                for (let i = 0; i < transcriptions.length; i++) {
                    console.log('\n-------------------------------------------');
                    if (crpt.cryptoPow(transcriptions[i].val, d, N) !== matrixF.matrix[transcriptions[i].v1][transcriptions[i].v2]) {
                        isVerified = false;
                        console.log("--------------NOT VERIFIED!----------------");
                        console.log(crpt.cryptoPow(transcriptions[i].val, d, N) + ' !== ' + matrixF.matrix[transcriptions[i].v1][transcriptions[i].v2]);
                    } else {
                        console.log(crpt.cryptoPow(transcriptions[i].val, d, N) + ' === ' + matrixF.matrix[transcriptions[i].v1][transcriptions[i].v2]);
                    }
                    console.log(JSON.stringify(transcriptions[i]));
                    console.log(`N: ${N}, d: ${d}, c: ${data.c}`);
                    console.log('-------------------------------------------');
                }
                // Проверка - указанный путь проходит через все вершины ровно по одному разу
                if (transcriptions.length != matrixG.n) {
                    isVerified = false;
                    console.log("--------------NOT VERIFIED!----------------");
                    console.log("NOT ALL VERTEXES INCLUDED INTO PATH");
                }
                for (let i = 0; i < matrixG.n; i++) {
                    for (let j = 0; j < matrixG.n; j++) {
                        if (i != j) {
                            if (transcriptions[i].v1 === transcriptions[j].v1) {
                                isVerified = false;
                                console.log("--------------NOT VERIFIED!----------------");
                                console.log(`The vertex: ${transcriptions[i].v1} repeated (i: ${i}, j: ${j}, val: ${transcriptions[i].val})`);
                            } else if (transcriptions[i].v2 === transcriptions[j].v2) {
                                isVerified = false;
                                console.log("--------------NOT VERIFIED!----------------");
                                console.log(`The vertex: ${transcriptions[i].v2} repeated (i: ${i}, j: ${j}, val: ${transcriptions[i].val})`);
                            }
                        }
                    }
                }
                break;
            case 1:
                console.log(`Выбран вопрос: 2. Действительно ли граф H изоморфен G?`);
                // Расшифровка графа F полностью (передача графа _H)
                let _H = new mx.Matrix(5, 5);
                _H.copyMatrix(matrixH);
                console.log("Matrix _H: ");
                _H.printMatrix();
                // Передача перестановок с помощью которых граф H был получен из графа G
                let permutation = matrixH.permutation;
                console.log("Permutations G -> H");
                console.log(JSON.stringify(permutation));
                // Проверка соответствия матрицы _H матрице F
                for (let i = 0; i < matrixG.n; i++) {
                    for (let j = 0; j < matrixG.n; j++) {
                        if (crpt.cryptoPow(_H.matrix[i][j], d, N) !== matrixF.matrix[i][j]) {
                            isVerified = false;
                            console.log("--------------NOT VERIFIED!----------------");
                            console.log(`The _H vertex: ${_H.matrix[i][j]} doesn\'t match the F vertex: ${matrixF.matrix[i][j]} (result: ${crpt.cryptoPow(_H.matrix[i][j], d, N)})`);
                        }
                    }
                }
                _H.decodeMatrix();
                let _G = new mx.Matrix(5, 5);
                // Получение перестановки для графа G по заданному порядку вершин
                _G.initShuffle(matrixG, permutation);
                // Проверка: предъявленные перестановки действительно переводят граф G в граф H
                let isSame = _G.compareMatrix(_H);
                if (!isSame) {
                    console.log("--------------NOT VERIFIED!----------------");
                    console.log(`The _H matrix: doesn\'t match the _G matrix`);
                    console.log(`Matrix _H: `);
                    _H.printMatrix();
                    console.log(`\nMatrix _G: `);
                    _G.printMatrix();
                }
                break;
        }

        if (isVerified === false) {
            return false;
        } else {
            console.log(`\n+_+_+_+_+_+_+Step ${t}: data is verified!+_+_+_+_+_+_+\n`);
        }

        questionNum = mx.getRandomNumber(0, 1);
    }

    console.log("-_-_-_-_-_Algorithm finished!_-_-_-_-_-_-");
}

module.exports = {zeroKnowledgeProof}