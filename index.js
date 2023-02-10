/* Protocol Conection */
const { Database } = require('./Mysql');
const process = require('process');

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


// const database = Database({
//   host: 'localhost',
//   user: 'root',
//   database: 'sch_spbmaxweb',
//   password: 'Solucionespb2.',
// });

// let scv;
// let listArgs;
// let nticket;
// let dateIn;
// let nterminal;

// database.connect((err) => {
//   if (err) {
//     database.end();
//     database.destroy();
//   };
// });
/*
scv = process.argv[2];
listArgs = scv.split(',');
nticket = listArgs[5];
dateIn = listArgs[4];
nterminal = parseInt(listArgs[3]);

database.query('CALL pa_insert_ticket(?,?,?,?);', [1, nterminal, dateIn, nticket],(err, result, fields) => {
  if (err) throw err;
  console.log(result);
});

database.end();
*/