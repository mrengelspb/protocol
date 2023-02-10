/* Protocol Conection */
const { Database } = require('./Mysql');
const { insertTicket } = require('./ticket');

const database = Database({
  host: 'localhost',
  user: 'root',
  database: 'sch_spbmaxweb',
  password: 'Solucionespb2.',
});
const net = require('net');
const port = 3070;
const host = 'localhost';

const server = net.createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});

let sockets = [];

server.on('connection', function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);

    sock.on('data', function(data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        data = data.toString()
        const list_trama = data.split(',');
        if (list_trama[0] === 'HS' && list_trama[1] === '10') {
          insertTicket(data, database);
        }
        // Write the data back to all the connected, the client will receive it as data from the server
        sockets.forEach(function(sock, index, array) {
            sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
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


