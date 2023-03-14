const { Socket } = require('./Adapters/Socket.js');
const { Protocol } = require('./Application/Protocol.js');
const { Database } = require('./Adapters/Database.js');


const protocol = new Protocol();
protocol.openPort({ adapter: Database, type: 'db' });
protocol.openPort({ adapter: Socket, port: 3070, type: 'ws' });

setImmediate(() => {
    if (process.env.OCTUPUS === 'down') {
        protocol.openPort({ adapter: Socket, port: 3070, type: 'ws' });
    }
});

