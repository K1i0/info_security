const http = require("http");
const fs = require("fs");
const hmt = require("hmt");

http.createServer(function(request,response){
    // response.writeHead(200, { 'Content-Type':'text/html'});
    console.log(`Запрошенный адрес: ${request.url}`);
    // получаем путь после слеша (путь файла относительно директории node в проекте)
    const filePath = 'src/node/' + request.url.substring(1);
    fs.readFile(filePath, function(error, data){
              
        if(error){
            response.statusCode = 404;
            response.end("Resourse not found!");
        }   
        else{
            response.end(data);
        }
    });
}).listen(3000, "127.0.0.1",function(){
    console.log(`Сервер начал прослушивание запросов на порту 3000`);
});

// http://localhost:3000/