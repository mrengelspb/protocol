const net = require('net');
const { Database } = require('./Mysql');
const port = 3070;
const host = '0.0.0.0';

class ServerTCP {
  constructor (Controller) {
    this.Controller = Controller;
    this.sockets = [];
    this.server = null;
  }
  init() {
      this.server = net.createServer();
      this.listen();
      this.server.on('connection',  (sock) => {
        console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
        this.sockets.push(sock);

        sock.on('data', async (data) => {
            console.log('DATA ' + sock.remoteAddress + ': ' + data);
            data = data.toString();

            const controller = new this.Controller(Database);
            controller.makeTrama(data);
            const response = await controller.execute();
            //Write the data back to all the connected, the client will receive it as data from the server
            this.sockets.forEach((sock, index, array) => {
                sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
                sock.write(JSON.stringify(response));
            });
        });
    
        // Add a 'close' event handler to this instance of socket
        sock.on('close', (data) => {
            let index = this.sockets.findIndex(function(o) {
                return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
            })
            if (index !== -1) this.sockets.splice(index, 1);
            console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        });
    });
  }

  listen() {
    this.server.listen(port, host, () => {
      console.log('TCP Server is running on port ' + port + '.');
    });
  }
}

exports.ServerTCP = ServerTCP;