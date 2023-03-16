const { Socket } = require('./Adapters/Socket.js');
const { Tcp } = require('./Adapters/Tcp.js');
const { Protocol } = require('./Application/Protocol.js');
const { Database } = require('./Adapters/Database.js');


const protocol = new Protocol();
protocol.openPort({ adapter: Database, type: 'db' });
protocol.openPort({ adapter: Tcp, port: 3070, type: 'tcp' });

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

