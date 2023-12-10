const http = require("http");
const fs = require("fs");
const hmt = require("./cryptoHmt.js");
const mx = require("./matrix.js");
const {PythonShell} = require('python-shell');
// const { default: test } = require("node:test");

http.createServer(function(request,response){
    // response.writeHead(200, { 'Content-Type':'text/html'});
    console.log(`Запрошенный адрес: ${request.url}`);
    // получаем путь после слеша (путь файла относительно директории node в проекте)
    const filePath = request.url.substring(1);
    fs.readFile(filePath, function(error, data){
              
        if(error){
            response.statusCode = 404;
            response.end("Resourse not found!");
        }   
        else{
            response.end(data);
        }
    });

    // let testMatrix = new mx.Matrix(5, 5);
    
    // // Генерация матрицы смежности для графа с Гамильтоновым циклом
    // do {
    //     console.log('Init new matrix');
    //     testMatrix.initMatrix();
    //     testMatrix.tryHamCycle();
    // } while(!testMatrix.hasCycle);

    // testMatrix.writeMatrix(); // Для отрисовки графа
    // testMatrix.writeFormatMatrix(); // Для алгоритма

    hmt.zeroKnowledgeProof();
    

    PythonShell.run('./visual.py', null).then(messages=>{
        // Данные, которые были выведены python скриптом в консоль
        if (messages.length > 0) {
            console.log(messages);
        }
        console.log('Python script finished');
    });
}).listen(3001, "127.0.0.1",function(){
    console.log(`Сервер начал прослушивание запросов на порту 3000`);
});

// http://localhost:3000/