const fs = require('fs');
const rsa = require("../encryptionlib.js");
const crpt = require('../cryptolib.js');

// Вернуть бинарное представление числа (строку)
const binary = (n) => {return n.toString(2);}

// "Конкатенация" (сцепление) двух чисел - элемента матрицы смежности 
// (0 / 1) и случайного числа r (2 старших бита которого не равны 1)
const concatNumbers = (a, b) => {
    return (a << 1) | b;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

class Matrix {
    #n=0; //vertexes
    #m=0; //edges
    #matrix=undefined;
    #hasCycle=false;
    #permutation=undefined;

    // Построение матрицы смежности
    constructor(n=4, m=4) {
        this.#n = n;
        this.#m = m;

        this.#matrix = new Array(n);
        // Матрица смежности (квадратная)
        for (let i = 0; i < n; i++) {
            this.#matrix[i] = new Array(n);
            for (let j = 0; j < n; j++) {
                this.#matrix[i][j] = 0;
            }
        }
    }

    get hasCycle() {
        return this.#hasCycle;
    }

    get n() {
        return this.#n;
    }

    get matrix() {
        return this.#matrix;
    }

    initMatrix() {
        if (this.#matrix === undefined) {
            return false;
        }

        for (let i = 0; i < this.#n; i++) {
            // Заполнение по диагонали
            for (let j = i; j < this.#n; j++) {
                // Без петель
                if (i === j) {
                    // this.#matrix[i][j] = 0;
                    continue;
                }
                // Добавить ребро между двумя вершинами
                this.#matrix[i][j] = this.#matrix[i][j] = getRandomNumber(0, 1); // set 0 | 1
            }
        }

        return true;
    }

    copyMatrix(object) {
        if (this.#n != object.n) {
            return false;
        }

        for (let i = 0; i < this.#n; i++) {
            for (let j = 0; j < this.#n; j++) {
                this.#matrix[i][j] = object.matrix[i][j];
            }
        }
    }

    // Заполнение матрицы с кодированием
    // Заменить конструктором копирования + отдельным методом кодирования
    fillWithEncodeMatrix(n, matrix, d, N) {
        this.#n = n;
        this.#m = n;

        // this.#matrix = new Array(n);
        for (let i = 0; i < n; i++) {
            // this.#matrix[i] = new Array(n);
            for (let j = 0; j < n; j++) {
                this.#matrix[i][j] = crpt.cryptoPow(matrix[i][j], d, N);
            }
        }

        this.#hasCycle = object.hasCycle;
    }

    decryptEdgess(path, c, n) {

        // 

        for (let i = 0; i < this.#n; i++) {
            for (let j = 0; j < this.#n; j++) {
                // if (i === )
                crpt.cryptoPow(this.#matrix[i][j], c, n);
            }
        }
    }

    printMatrix() {
        if (this.#matrix === undefined) {
            return false;
        }

        let line = '';
        for (let i = 0; i <  this.#n; i++) {
            for (let j = 0; j <  this.#n; j++) {
                line += this.#matrix[i][j] + (j < this.#n - 1 ? ', ' : '');

                if (j === this.#n - 1) {
                    console.log(line);
                    line = '';
                }
            }
        }

        return true;
    }

    readMatrix(filePath='data/graph.txt') {
        const data = fs.readFileSync(filePath, 'utf8');
        // Convert JSON format array to JavaScript array
        this.#matrix = JSON.parse(data);
    }

    readFormatMatrix(filePath='data/graph_test_info2.txt') {
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.split(/\r?\n/);

        let nums = lines[0].split(' '); //N, M
        this.#n = Number(nums[0]);
        this.#m = Number(nums[1]);
        
        let i = 0;
        let j = 0
        // Цикл без учета 1й строки, т.к. там содержатся N и M
        for (const line of lines.splice(1)) {
            if (line.length > 0) {
                i = Number(line.split(' ')[0]);
                j = Number(line.split(' ')[1]);
                if ((i < 0 || i >= this.#n) || (j < 0 || j >= this.#n)) {
                    console.error(`Vertexes numbers is not valid: v1: ${i}, v2: ${j}`);
                    return false
                }
                // В методе записи дублируются ребра (Например, 1 0 и 0 1)
                // Двойная работа, если не исправить дубли в записи
                console.log(this.#matrix[i][j])
                this.#matrix[i][j] = this.#matrix[j][i] = 1;
            }
        }
        return true;
    }

    writeMatrix(filePath='data/graph.txt') {
        if (this.#matrix === undefined) {
            return false;
        }

        fs.writeFile(filePath, JSON.stringify(this.#matrix), function(error){
            if(error) throw error; // ошибка чтения файла, если есть
            console.log('Matrix saved');
         });

         return true;
    }

    writeFormatMatrix(filePath='data/graph_test_info2.txt') {
        if (this.#matrix === undefined) {
            return false;
        }

        // Clear file before write
        fs.writeFile(filePath, '', function(){})

        // Write N, M into file
        fs.writeFileSync(
            filePath,
            this.#n + ' ' + this.#m + '\n',
            { encoding: "utf-8", flag: "a" }
        );

        // Write edges into file (vertex1 vertex2)
        for (let i = 0; i < this.#n; i++) {
            for (let j = 0; j < this.#n; j++) {
                if (this.#matrix[i][j])
                    fs.writeFileSync(
                        filePath,
                        i + ' ' + j + '\n',
                        { encoding: "utf-8", flag: "a" }
                    );
            }
        }
        
        return true;
    }

    writePath(path=[], filePath='data/path.txt') {
        fs.writeFile(filePath, JSON.stringify(path), function(error){
            if(error) throw error; // ошибка чтения файла, если есть
            console.log('Path saved');
         });
    }

    tryHamCycle() {
        let path = new Array();
        // Создать массив посещенных вершин и заполнить его значением false
        let visited = new Array(this.#n).fill(false);

        this.findHamCycle(0, path, visited);

        if (!this.#hasCycle) {
            console.log('Hamiltonian Cycle not found!');
        }
    }

    findHamCycle(current=0, path=[], isVisited=[])
    {
        // Если все вершины включены в путь (найден Гамильтонов путь)
        path.push(current);
        if (path.length == this.#n) {
            console.log(JSON.stringify(path));
            this.writePath(path);
            // Соединена ли последняя вершина пути с первой (есть ли цикл)
            if (this.#matrix[path[0]][path.at(-1)] == 1) {
                this.#hasCycle = true;
                return true;
            } else {
                // Удалить последнюю добавленную вершину из списка
                path.pop();
                return false;
            }
        }

        // Если длина списка меньше, то текущая вершина current отмечается как посещенная
        isVisited[current] = true;

        // И осуществляется перебор дальнейших продолжений
        for (let next = 0; next < this.#n; ++next) {
            if (this.#matrix[current][next] === 1 && !isVisited[next]) {
                // Найти первый подходящий цикл
                if (this.findHamCycle(next, path, isVisited)) {
                    return true;
                }
            }
        }
        isVisited[current] = false;
        path.pop();
        return false;
    }

    buildPermutation(filePath='data/graph_test_info2.txt', shuffle=undefined) {
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.split(/\r?\n/);

        let nums = lines[0].split(' '); //N, M
        this.#n = Number(nums[0]);
        this.#m = Number(nums[1]);

        // Генерация перестановки вершин графа
        if (shuffle === undefined) {
            this.#permutation = new Array(this.#n);
            for (let i = 0; i < this.#n; i++) {
                this.#permutation[i] = i;
            }
            this.#permutation.sort(() => Math.random() - 0.5);
        } else {
            // Заданная перестановка
            this.#permutation = shuffle;
        }
        
        let i = 0;
        let j = 0
        // Цикл без учета 1й строки, т.к. там содержатся N и M
        for (const line of lines.splice(1)) {
            // Использование перестановка для генерации изоморфного графа
            i = Number(line.split(' ')[0]);
            i = this.#permutation[i];

            j = Number(line.split(' ')[1]);
            j = this.#permutation[j];


            // console.log(`${i}, ${j}`);
            if ((i < 0 || i >= this.#n) || (j < 0 || j >= this.#n)) {
                console.error(`Vertexes numbers is not valid: v1: ${i}, v2: ${j}`);
                return false
            }
            // В методе записи дублируются ребра (Например, 1 0 и 0 1)
            // Двойная работа, если не исправить дубли в записи
            // TO DO - исправить))
            this.#matrix[i][j] = this.#matrix[j][i] = 1;
        }
        return true;
    }

    encodeMatrix() {
        if (this.#matrix === undefined) {
            return false;
        }

        let randNum = [];
        for (let i = 0; i < this.#n; i++) {
            for (let j = 0; j < this.#n; j++) {
                //generate random r
                let r = getRandomNumber(1000, 10000);
                randNum.push(r);
                /*
                    Алиса кодирует матрицу H, приписывая к 
                    первоначально содержащимся в ней нулям и 
                    единицам случайные числа rij по схеме
                    ̃Hij = rij ‖ Hij .
                */
                this.#matrix[i][j] = concatNumbers(r, this.#matrix[i][j]);
            }
        }

        return randNum;
    }

    encry
}

module.exports = {getRandomNumber, Matrix, binary, concatNumbers}