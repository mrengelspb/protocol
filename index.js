/* Protocol Conection */
const express = require('express');
const { WebService } = require('./WebService');
const { screenPrinter } = require('./ScreenServer');
const { Controller } = require('./Controller');
const { database } = require('./Mysql');

const cors = require('cors');
const TicketController = require('./routes');
require('dotenv').config();
function RunServer() {
    const webService = new WebService(Controller);
    webService.init(database);

    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use("/ticket", TicketController);
    app.listen(3001, () => {console.log("Server running on port: 3001")});

    setInterval(async () => {
        let avaliablePlaces;
        avaliablePlaces = await database.getPlacesBySection();
    
        if (avaliablePlaces[0].VAR1 != 0) {
            screenPrinter(`LIBRES -> ${avaliablePlaces[0].VAR1}`, "green", 2);
        } else {
            screenPrinter(`LIBRES -> ${avaliablePlaces[0].VAR1}`, "red", 2);
        }

        if (avaliablePlaces[0].VAR2 != 0) {
            setTimeout(() => {
                screenPrinter(`${avaliablePlaces[0].VAR2} <- LIBRES`, "green", 2);
            }, 10000);
        } else {
            setTimeout(() => {
                screenPrinter(`${avaliablePlaces[0].VAR2} <- LIBRES`, "red", 2);
            }, 10000);
        }


        if (avaliablePlaces[0].VAR3 != 0) {
            screenPrinter(`${avaliablePlaces[0].VAR3} <- LIBRES`, "green", 3);
        } else {
            screenPrinter(`${avaliablePlaces[0].VAR3} <- LIBRES`, "red", 3);
        }
        if (avaliablePlaces[0].VAR4 != 0) {
            screenPrinter(`LIBRES -> ${avaliablePlaces[0].VAR4}`, "green", 1);
        } else {
            screenPrinter(`LIBRES -> ${avaliablePlaces[0].VAR4}`, "red", 1);
        }
    }, 20000);
}

RunServer();
