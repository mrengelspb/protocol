/* Protocol Conection */
const express = require('express');
const events = require('events');
const { ServerTCP } = require('./ServerTCP');
const { Controller } = require('./Controller');
const cors = require('cors');
const TicketController = require('./routes');
require('dotenv').config();

const eventEmitter = new events.EventEmitter();

function RunServer() {
    const serverTCP = new ServerTCP(Controller);
    serverTCP.init();

    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use("/ticket", TicketController);
    app.listen(3000, () => {console.log("Server running on port: 3000")});
}

eventEmitter.on('scream', RunServer);

RunServer();
