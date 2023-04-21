const express = require('express');
const cors = require('cors');
const TicketController = require('../routes');


class Http {
    init(port) {
        const app = express();
        app.use(express.json());
        app.use(cors());
        app.use("/ticket", TicketController);
        app.listen(port, () => {console.log(`Server Http running on port: ${port}`)});
    }
}

module.exports.Http = Http;