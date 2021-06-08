const http = require("http");
const fs = require("fs").promises;
const PORT = 8081;

const requestHandler = async (request, response) => {
  const manifest = await fs.readFile("./package.json", "utf8");
  if (request.url.indexOf("/home") >= 0) {
    response.writeHead(200, { "Content-type": "text/json" });
    return response.end(manifest);
  }
};
//   response.writeHead(200, { "Content-type": "text/json" });
//   return response.end('{ "url": "other" }');
// };
const server = http.createServer(requestHandler);

server.listen(PORT, (err) => {
  if (err) {
    console.error("Ошибка запуска сервера:", err);
  }
  console.log(`Сервер работает на порте ${PORT}!`);
});
