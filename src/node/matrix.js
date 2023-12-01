const fs = require('fs');

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

class Matrix {
    #n=0; //vertexes
    #m=0; //edges
    #matrix=undefined;
    #hasCycle=false;

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
        console.log(`N: ${ this.#n}`);
        console.log(`M: ${this.#m }`);
        
        let i = 0;
        let j = 0
        // Цикл без учета 1й строки, т.к. там содержатся N и M
        for (const line of lines.splice(1)) {
            i = Number(line.split(' ')[0]);
            j = Number(line.split(' ')[1]);
            if ((i < 0 || i >= this.#n) || (j < 0 || j >= this.#n)) {
                console.error(`Vertexes numbers is not valid: v1: ${i}, v2: ${j}`);
                return false
            }
            // В методе записи дублируются ребра (Например, 1 0 и 0 1)
            // Двойная работа, если не исправить дубли в записи
            this.#matrix[i][j] = this.#matrix[j][i] = 1;
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
        fs.writeFile(filePath, '', function(){console.log('done')})

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

    hasHamCycle() {
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
}

module.exports = {getRandomNumber, Matrix}