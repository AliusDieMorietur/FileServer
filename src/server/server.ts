import * as http from 'http'

const server = http.createServer((req, res) => {
  const VERY_IMPORTANT_INFORMATION: { hello: number } = { hello: 1 };
  console.log(1);
  res.writeHead(200);
  res.end(JSON.stringify(VERY_IMPORTANT_INFORMATION));
});

console.log("listen on 8000");
server.listen(8000);