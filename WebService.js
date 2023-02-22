const { Server } = require('ws');
const { Database } = require('./Mysql');
class WebService {
  constructor(Controller) {
    this.Controller = Controller;
  }

  init() {
    this.sockserver = new Server({ port: 3070 });
    this.connections = new Set();
    this.sockserver.on('connection', (ws) => {
      process.env.DATABASE = true;
      this.connections.add(ws)
      ws.on('message', async (data) => {
        data = data.toString();
        console.log(data);
        const controller = new this.Controller(Database);
        controller.makeTrama(data);
        const response = await controller.execute();
        if (response !== 'exitoso') {
          console.log(response);
          ws.send(response);
        }

        /*connections.forEach((client) => {
            client.send(JSON.stringify(message));
            //client.send("Llego mensaje, este es el retorno");
        })*/
      });

      ws.on('close', () => {
        this.connections.delete(ws);
        process.env.DATABASE = false;
        console.log('Client fue desconectado!');
      });
    });
  }
}

exports.WebService = WebService;
