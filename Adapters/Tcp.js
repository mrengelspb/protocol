const net = require('net');
const { PlotV1 } = require('../Entities/PlotV1.js');
const { PlotV2 } = require('../Entities/PlotV2.js');

class Tcp {
  constructor(database) {
    this.server = net.createServer();
    this.counterA = 10;
    this.counterB = 10;
    this.plot = new PlotV2(database);
    this.database = database;
    //this.controller = new Controller(database);
  }
  init() {
    this.server.on('connection', (socket) => {
        socket.on('data', async (line) => 
        {
          let trama;
            if (line.toString() === "SPB,Faraday,V2,\r\n" || line.toString() === "SPB,Faraday,V2,\\r\\n") {
                this.plot = new PlotV2(this.database);
                socket.write("SV,Octupus,V2,Faraday,\r\n");
                return;
              } else if (line.toString() === "SPB,Faraday,V1,\r\n") {
                this.plot = new PlotV1(this.database);
                socket.write("SV,Octupus,V1,Faraday,\r\n");
                return
              }
              try {
                trama = this.plot.makeTrama(line);
              } catch (error) {
                process.env.DATABASE = 'down';
              }
              let response;
              try {
                response = await this.plot.execute(trama);
                this.plot.showTrama(trama);
              } catch (error) {
                console.log(error);
                response = "Server Error reconnecting...";
                process.env.OCTUPUS = 'down';
              }
              
              // this.controller.makeTrama(data);
              // if (this.controller.trama.nTerminal === '1') {
              //   this.counterA = 10;
              //   process.env.CONTROLLER_1 = true;
              // } else if (this.controller.trama.nTerminal === '2') {
              //   this.counterB = 10;
              //   process.env.CONTROLLER_2 = true;
              // }
              // const response = await this.controller.execute();
              // if (response !== 'exitoso') {
              //   console.log(response);
              //   ws.send(response);
              // }
              console.log(response);
              socket.write(response);
        });
        socket.on('error', (err) => {
            console.log('Error: Client Desconnected... ', err.message);
            process.env.OCTUPUS = 'down';
        });
    });

    this.server.listen(3070, function() {
        console.log('server listening to 3070');
    });

    this.server.on('close', () => {
        // if (this.counterA === 0 && this.controller.trama.nTerminal !== '1') {
        //   process.env.CONTROLLER_1 = false;
        // } else if (this.counterB === 0 && this.controller.trama.nTerminal !== '2') {
        //   process.env.CONTROLLER_2 = false;
        // }
            console.log('Client was disconnected!');
        });

    this.server.on('error', (err) => {
        console.log('Error: ', err.message);
        process.env.OCTUPUS = 'down';
    });
  }

  listenControllerStatus() {
    setInterval(() => {
      this.counterA--;
      this.counterB--;
    }, 1000);

    setInterval(() => {
      if (this.counterA === 0 && this.controller.trama.nTerminal !== '1') {
        process.env.CONTROLLER_1 = false;
        this.counterA = 10;
      } else if (this.counterB === 0 && this.controller.trama.nTerminal !== '2') {
        process.env.CONTROLLER_2 = false;
        this.counterB = 10;
      }
    }, 1000);
  }
}

exports.Tcp = Tcp;