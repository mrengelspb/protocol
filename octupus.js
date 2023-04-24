#!/bin/bash/env node
const { Socket } = require('./Adapters/Socket.js');
const { Tcp } = require('./Adapters/Tcp.js');
const { Http } = require('./Adapters/Http.js');
const { Protocol } = require('./Application/Protocol.js');
const { Database } = require('./Adapters/Database.js');
const { screenPrinter } = require('./ScreenClient.js');

console.log("---------------- Octupus V.2.0.1 ----------------");
console.log("Soluciones Plan B, Todos los derechos reservados.");
console.log("         ________________________ ")
console.log("        |                        |") 
console.log("        |                        |") 
console.log("        |    [O]           [O]   |") 
console.log("        |                        |") 
console.log("        |         -------        |") 
console.log("        |                        |") 
console.log("        --------------------------") 
console.log("          | \\    /    \  |  /    ") 
console.log("          | \\'   '/   \` | /     ")
console.log("         /  \ \   / \_ / /  \     ")
console.log("       /   /    \ \   \ \    \    ")
console.log("       |  |     /  \    \ -    \  ")
console.log("       \ \     /_   \   /  \   // ")
console.log("        \ \_   /     \  \   _/  \ ")
console.log("        `\  \  \      \ /        /")
console.log("\n\nOC -> Starting Ports and Adapters");
try {
    const protocol = new Protocol();
    protocol.openPort({ adapter: Database, type: 'db' });
    protocol.openPort({ adapter: Tcp, port: 3070, type: 'tcp' });
    protocol.openPort({ adapter: Http, port: 3001, type: 'http' });
    setImmediate(() => {
        if (process.env.OCTUPUS === 'down') {
            process.env.OCTUPUS = 'Ok';
            protocol.openPort({ adapter: Tcp, port: 3070, type: 'tcp' });
        }
    });
    setImmediate(() => {
        if (process.env.DATABASE === 'down') {
            process.env.DATABASE = 'Ok';
            protocol.openPort({ adapter: Tcp, port: 3070, type: 'tcp' });
        }
    });
} catch (error) {
    console.log("OC -> Error starting Ports and Adapters");
}


try {
    console.log("OC -> Starting screen printer loops");
    let database = new Database('local');
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
            }, 20);
        } else {
            setTimeout(() => {
                screenPrinter(`${avaliablePlaces[0].VAR2} <- LIBRES`, "red", 2);
            }, 20);
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
    }, 20);
} catch (error) {
    console.log("OC -> Error starting screen printer loops");
}


