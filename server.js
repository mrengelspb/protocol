const net = require('net');
const sha1 = require('sha1');
const base64 = require('base-64');
const port = 3070;
const host = '0.0.0.0';

const server = net.createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});

let sockets = [];

server.on('connection', function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);

    sock.on('data', function(data) {
        let data2 = data.toString().split('\r\n');
        data2.pop();
        data2.pop();
        let key = data2.pop().split(' ')[1];
        key += '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
        key = base64.encode(sha1(key));
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // Write the data back to all the connected, the client will receive it as data from the server
        sockets.forEach(function(sock, index, array) {
            // HTTP/1.1 101 Switching Protocols
            // Upgrade: websocket
            // Connection: Upgrade
            // Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
            const str = `HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${key}\r\n\r\n`;
            console.log("********")
            console.log(str);
            console.log("********")
            sock.write(str);
        });
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});
