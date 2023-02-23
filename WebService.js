const { Server } = require('ws');
const { Database } = require('./Mysql');
class WebService {
  constructor(Controller) {
    this.Controller = Controller;
  }

  init() {
    this.sockserver = new Server({ port: 3070 });
    this.connections = new Set();
    let counterA = 10;
    let counterB = 10;
    const controller = new this.Controller(Database);
    
    setInterval(()=> {
      counterA--;
      counterB--;
    }, 1000);

    setInterval(()=> {
        if (counterA === 0 && controller.trama.nTerminal !== '1') {
          process.env.CONTROLLER_1 = false;
          counterA = 10;
        } else if (counterB === 0 && controller.trama.nTerminal !== '2') {
          process.env.CONTROLLER_2 = false;
          counterB = 10;
        }
    }, 1000);
    
    this.sockserver.on('connection', (ws) => {
      this.connections.add(ws);
      ws.on('message', async (data) => {
        data = data.toString();
        console.log(data);
        controller.makeTrama(data);
        if (controller.trama.nTerminal === '1') {
          counterA = 10;
          process.env.CONTROLLER_1 = true;
        } else if (controller.trama.nTerminal === '2') {
          counterB = 10;
          process.env.CONTROLLER_2 = true;
        }
        const response = await controller.execute();
        if (response !== 'exitoso') {
          console.log(response);
          ws.send(response);
        }
      });

      ws.on('close', () => {
        this.connections.delete(ws);
        if (counterA === 0 && controller.trama.nTerminal !== '1') {
          process.env.CONTROLLER_1 = false;
        } else if (counterB === 0 && controller.trama.nTerminal !== '2') {
          process.env.CONTROLLER_2 = false;
        }
        console.log('Client fue desconectado!');
      });
    });
  }
}

exports.WebService = WebService;
