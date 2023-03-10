/* Protocol Conection */
const express = require('express');
const { WebService } = require('./WebService');
const { screenPrinter } = require('./ScreenServer');
const { Controller } = require('./Controller');
const { Database } = require('./Mysql');

const cors = require('cors');
const TicketController = require('./routes');
require('dotenv').config();
let flag = false;
function RunServer() {
    const webService = new WebService(Controller);
    webService.init();

    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use("/ticket", TicketController);
    app.listen(3000, () => {console.log("Server running on port: 3000")});

    setInterval(async () => {
        let avaliablePlaces;
        const database = new Database();
        database.init();
        avaliablePlaces = await database.getPlacesBySection();
        if (flag) {
            if (avaliablePlaces[0].VAR1 != 0) {
                screenPrinter(`LIBRES -> ${avaliablePlaces[0].VAR1}`, "green", 2);
            } else {
                screenPrinter(`LIBRES -> ${avaliablePlaces[0].VAR1}`, "red", 2);
            }
            flag = false;
        } else {
            if (avaliablePlaces[0].VAR2 != 0) {
                screenPrinter(`${avaliablePlaces[0].VAR2} <- LIBRES`, "green", 2);
            } else {
                screenPrinter(`${avaliablePlaces[0].VAR2} <- LIBRES`, "red", 2);
            }
            flag = true;
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
