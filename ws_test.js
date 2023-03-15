const WebSocket = require('ws');
const input = process.stdin;

input.setEncoding('utf-8');

const ws = new WebSocket('ws://localhost:3070/');

ws.on('error', console.error);

ws.on('open', function open() {
  ws.send("SPB,Faraday V2");
});

ws.on('message', function message(data) {
  console.log(data.toString());
});

input.on('data', (data) => {
  setInterval(() => {
    ws.send('HS,20,14,1,\r\n');
  }, 100);
});