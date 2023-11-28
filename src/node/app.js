const http = require("http");
const fs = require("fs");
// const hmt = require("hmt");
const mx = require("./matrix.js");
const {PythonShell} = require('python-shell');
const { default: test } = require("node:test");

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

    let matrix = new mx.Matrix();
    // matrix.initMatrix();
    // matrix.printMatrix();
    // matrix.writeMatrix();
    // matrix.writeFormatMatrix();

    let testMatrix = new mx.Matrix();
    testMatrix.readFormatMatrix();
    testMatrix.printMatrix();


    PythonShell.run('./visual.py', null).then(messages=>{
        // Данные, которые были выведены python скриптом в консоль
        if (messages.length > 0) {
            console.log(messages);
        }
        console.log('Python script finished');
    });
}).listen(3000, "127.0.0.1",function(){
    console.log(`Сервер начал прослушивание запросов на порту 3000`);
});

// http://localhost:3000/