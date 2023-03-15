const { Server } = require('ws');
const { PlotV1 } = require('../Entities/PlotV1.js');
const { PlotV2 } = require('../Entities/PlotV2.js');

class Socket {
  constructor(database) {
    this.sockserver = new Server({ port: 3070 });
    this.connections = new Set();
    this.counterA = 10;
    this.counterB = 10;
    this.plot = null;
    this.database = database;
    //this.controller = new Controller(database);
  }
  init() {
    this.sockserver.on('connection', (ws) => {
      console.log("Client connected");
      
      this.connections.add(ws);
      ws.on('message', async (line) => {
        if (line.toString() === "SPB,Faraday V2") {
          this.plot = new PlotV2(this.database);
          ws.send("Octupus <-- V2 --> Faraday");
          return;
        } else if (line.toString() === "SPB,Faraday V1") {
          this.plot = new PlotV1(this.database);
          ws.send("Octupus <-- V1 --> Faraday");
        }
        this.plot.makeTrama(line);
        let response;
        try {
          response = await this.plot.execute();
        } catch (error) {
          console.log(error);
          response = "Server Error reconnecting...";
          process.env.OCTUPUS = 'down';
        }
        console.log(this.plot.showTrama());
        
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
        ws.send(response);
      });

      ws.on('close', () => {
        this.connections.delete(ws);
        // if (this.counterA === 0 && this.controller.trama.nTerminal !== '1') {
        //   process.env.CONTROLLER_1 = false;
        // } else if (this.counterB === 0 && this.controller.trama.nTerminal !== '2') {
        //   process.env.CONTROLLER_2 = false;
        // }
        console.log('Client was disconnected!');
      });
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

exports.Socket = Socket;