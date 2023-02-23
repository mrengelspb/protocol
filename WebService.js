const { Server } = require('ws');
const { Database } = require('./Mysql');
class WebService {
  constructor(Controller) {
    this.Controller = Controller;
  }

  init() {
    this.sockserver = new Server({ port: 3070 });
    this.connections = new Set();
    let counter = 10;
    const controller = new this.Controller(Database);
    
    setInterval(()=> {
      counter--;
    }, 1000);

    setInterval(()=> {
      if (counter === 0){
        if (controller.trama.nTerminal === '1') {
          process.env.CONTROLLER_1 = false;
        } else if (controller.trama.nTerminal === '2') {
          process.env.CONTROLLER_2 = false;
        }
        counter = 10;
      }
    }, 1000);
    
    this.sockserver.on('connection', (ws) => {
      this.connections.add(ws);
      ws.on('message', async (data) => {
        counter = 10;
        data = data.toString();
        console.log(data);
        controller.makeTrama(data);
        if (controller.trama.nTerminal === '1') {
          process.env.CONTROLLER_1 = true;
        } else if (controller.trama.nTerminal === '2') {
          process.env.CONTROLLER_2 = true;
        }
        const response = await controller.execute();
        if (response !== 'exitoso') {
          console.log(response);
          ws.send(response);
        }
        counter++;
      });

      ws.on('close', () => {
        this.connections.delete(ws);
        if (controller.trama.nTerminal === '1') {
          process.env.CONTROLLER_1 = false;
        } else if (controller.trama.nTerminal === '2') {
          process.env.CONTROLLER_2 = false;
        }
        console.log('Client fue desconectado!');
      });
    });
  }
}

exports.WebService = WebService;
