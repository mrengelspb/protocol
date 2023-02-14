/* Protocol Conection */
const events = require('events');
const { ServerTCP } = require('./ServerTCP');
const { Controller } = require('./Controller');
require('dotenv').config();

const eventEmitter = new events.EventEmitter();

function RunServerTCP() {
    const serverTCP = new ServerTCP(Controller);
    serverTCP.init();
}

eventEmitter.on('scream', RunServerTCP);


RunServerTCP();
