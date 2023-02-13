/* Protocol Conection */
const { ServerTCP } = require('./ServerTCP');
const { Controller } = require('./Controller');
require('dotenv').config();

const serverTCP = new ServerTCP(Controller);
serverTCP.init();