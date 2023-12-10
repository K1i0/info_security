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

// Разделить числа (вернуть 1 или 0)
const separateNumbers = (a) => {
    return (a & 1);
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

class Matrix {
    #n=0; //vertexes
    #m=0; //edges
    #matrix=undefined;
    #hasCycle=false;
    #hamPath=undefined; //Гаимльтонов путь
    #permutation=undefined;

    // Построение матрицы смежности NxN с инициализацией нулями
    // input: n?, m?
    constructor(n=4, m=4) {
        this.#n = n;
        this.#m = m;

        this.#matrix = new Array(n);
        for (let i = 0; i < n; i++) {
            this.#matrix[i] = new Array(n).fill(0);
        }
    }

    get hasCycle() {
        return this.#hasCycle;
    }

    get hamPath() {
        return this.#hamPath;
    }

    get n() {
        return this.#n;
    }

    get matrix() {
        return this.#matrix;
    }

    get permutation() {
        return this.#permutation;
    }

    // Случайная инициализация матрицы смежности (построение графа)
    initMatrix() {
        // Флаг отсутствия связей (если все элементы строки равны 0)
        let isEmpty = true;
        for (let i = 0; i < this.#n; i++) {
            do {
                // Заполнение по диагонали
                for (let j = i; j < this.#n; j++) {
                    // Без петель
                    if (i === j) {
                        continue;
                    }
                    // Добавить ребро между двумя вершинами
                    this.#matrix[i][j] = this.#matrix[j][i] = getRandomNumber(0, 1); // set 0 | 1
                }
                // Проверка - имеет ли вершина связь с другими вершинами
                for (let j = 0; j < this.#n; j++) {
                    if (i === j) {
                        continue;
                    }
                    if (this.#matrix[i][j] === 1) {
                        isEmpty = false;
                    }
                }
            } while(isEmpty);
        }
    }

    // Копировать матрицу смежности 
    // input: Matrix object
    copyMatrix(object) {
        // Важно, чтобы совпадала размерность матриц
        if (this.#n != object.n) {
            return false;
        }
        for (let i = 0; i < this.#n; i++) {
            for (let j = 0; j < this.#n; j++) {
                this.#matrix[i][j] = object.matrix[i][j];
            }
        }
    }

    // Вывод матрицы смежности и Гамильтонова пути в графе (при наличии)
    printMatrix() {
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

        if (this.#hamPath != undefined) {
            console.log(JSON.stringify(this.#hamPath));
        }

        return true;
    }

    // Считать матрицу из файла (по матрице смежности)
    // input: filePath
    readMatrix(filePath='data/graph.txt') {
        const data = fs.readFileSync(filePath, 'utf8');
        // Convert JSON format array to JavaScript array
        this.#matrix = JSON.parse(data);
    }

    // Считать матрицу из файла (по формату РГР)
    // input: filePath?
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
                // Двойная работа, если не исправить дубли в записи (метод writeFormatMatrix)
                this.#matrix[i][j] = this.#matrix[j][i] = 1;
            }
        }
        return true;
    }

    // Считать путь в графе из файла
    readPath(filePath='data/path.txt') {
        const data = fs.readFileSync(filePath, 'utf8');
        // Convert JSON format array to JavaScript array
        this.#hamPath = JSON.parse(data);
    }

    // Записать матрицу в файл (матрица смежности)
    // input: filePath
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

    // Ready. Записать матрицу в файл (по формату РГР)
    // input: filePath?
    // output: true / false
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

    // Ready. Записать Гамильтонов путь в файл
    // input: filePath
    writePath(filePath='data/path.txt') {
        fs.writeFile(filePath, JSON.stringify(this.#hamPath), function(error){
            if(error) throw error; // ошибка чтения файла, если есть
            console.log('Path saved');
         });
    }

    // Входная точка для поиска Гамильтонова цикла в графе
    tryHamCycle() {
        let path = new Array();
        // Создать массив посещенных вершин и заполнить его значением false
        let visited = new Array(this.#n).fill(false);

        this.findHamCycle(0, path, visited);

        if (!this.#hasCycle) {
            console.log('Hamiltonian Cycle not found!');
        }
    }

    // Алгоритм поиска Гамильтонова цикла
    findHamCycle(current=0, path=[], isVisited=[])
    {
        // Если все вершины включены в путь (найден Гамильтонов путь)
        path.push(current);
        if (path.length == this.#n) {
            this.#hamPath = path;
            console.log(JSON.stringify(this.#hamPath));
            this.writePath();
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

    // Ready. Заполнить матрицу, на основе другой, с учетом перестановки (построить изоморфный граф)
    // input: source matrix object, shuffle?
    // out: shuffle
    initShuffle(src, shuffle=undefined) {
        // Генерация перестановки вершин графа
        if (shuffle === undefined) {
            shuffle = new Array(this.#n);
            for (let i = 0; i < this.#n; i++) {
                shuffle[i] = i;
            }
            shuffle.sort(() => Math.random() - 0.5);
        }
        this.#permutation = shuffle;

        let _i = 0;
        let _j = 0;
        for (let i = 0; i < this.#n; i++) {
            _i = shuffle[i];
            for (let j = 0; j < this.#n; j++) {
                _j = shuffle[j];
                this.#matrix[_i][_j] = src.matrix[i][j];
            }
        }

        // Возвращает перестановку
        return shuffle;
    }

    // Кодирование матрицы путем сцепления чисел: r || M[i][j]
    // out: randNum[] - массив случайных чисел, использованных при кодировании
    encodeMatrix() {
        for (let i = 0; i < this.#n; i++) {
            for (let j = 0; j < this.#n; j++) {
                //generate random r
                let r = getRandomNumber(1000, 10000);
                /*
                    Алиса кодирует матрицу H, приписывая к первоначально содержащимся в ней нулям и 
                    единицам случайные числа rij по схеме ̃Hij = rij ‖ Hij .
                */
                this.#matrix[i][j] = concatNumbers(r, this.#matrix[i][j]);
            }
        }
    }

    // Шифрование матрицы
    // input: d, N - открытые параметры системы RSA
    encryptMatrix(d, N) {
        for (let i = 0; i < this.#n; i++) {
            for (let j = 0; j < this.#n; j++) {
                this.#matrix[i][j] = crpt.cryptoPow(this.#matrix[i][j], d, N);
            }
        }
    }

    // Вернуть список закодированных (_H) ребер графа (v1, v2, F[v1][v2])
    decryptEdgess(path, shuffle, c, N) {
        let transcriptions = new Array(path.length);
        for (let i = 0; i < path.length; i++) {
            transcriptions[i] = new Object();
            transcriptions[i].v1 = shuffle[path[i]];
            transcriptions[i].v2 = shuffle[path[i < path.length - 1 ? i + 1 : 0]];
            transcriptions[i].val = crpt.cryptoPow(this.#matrix[transcriptions[i].v1][transcriptions[i].v2], c, N);
        }

        return transcriptions;
    }

    // Декодирование матрицы (отбросить r, оставить только 0 или 1)
    decodeMatrix() {
        for (let i = 0; i < this.#n; i++) {
            for (let j = 0; j < this.#n; j++) {
                this.#matrix[i][j] = separateNumbers(this.#matrix[i][j]);
            }
        }
    }

    // Сравнение матриц смежности
    compareMatrix(object) {
        let isSame = true;
        for (let i = 0; i < this.#n; i++) {
            for (let j = 0; j < this.#n; j++) {
                if (this.#matrix[i][j] != object.matrix[i][j]) {
                    console.log(`${this.#matrix[i][j]} != ${object.matrix[i][j]} (i: ${i}, j: ${j})`);
                    isSame = false;
                }
            }
        }
        return isSame;
    }
}

module.exports = {getRandomNumber, Matrix, binary, concatNumbers}