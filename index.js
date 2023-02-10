/* Protocol Conection */
const { ServerTCP } = require('./ServerTCP');
const { Controller } = require('./Controller');

const serverTCP = new ServerTCP(Controller);
serverTCP.init();