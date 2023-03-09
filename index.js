/* Protocol Conection */
const express = require('express');
const { WebService } = require('./WebService');
// const { ScreenServer } = require('./ScreenServer');
const { Controller } = require('./Controller');
const cors = require('cors');
const TicketController = require('./routes');
require('dotenv').config();

function RunServer() {
    const webService = new WebService(Controller);
    webService.init();

    // const screenServer = new ScreenServer();
    // screenServer.init();

    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use("/ticket", TicketController);
    app.listen(3000, () => {console.log("Server running on port: 3000")});
}

RunServer();
