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
    setInterval(()=> {
      counter--;
    }, 1000);

    setInterval(()=> {
      if (counter === 0){
        process.env.CONTROLLER = false;
        counter = 10;
      }
    }, 1000);

    this.sockserver.on('connection', (ws) => {
      process.env.CONTROLLER = true;
      this.connections.add(ws);
      ws.on('message', async (data) => {
        counter = 10;
        data = data.toString();
        console.log(data);
        const controller = new this.Controller(Database);
        controller.makeTrama(data);
        const response = await controller.execute();
        if (response !== 'exitoso') {
          console.log(response);
          ws.send(response);
        }
        counter++;
      });

      ws.on('close', () => {
        this.connections.delete(ws);
        process.env.CONTROLLER = false;
        console.log('Client fue desconectado!');
      });
    });
  }
}

exports.WebService = WebService;
