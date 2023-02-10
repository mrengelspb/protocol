/* Protocol Conection */
const { Database } = require('./Mysql');
const net = require('node:net');

const database = Database({
  host: 'localhost',
  user: 'root',
  database: 'sch_spbmaxweb',
  password: 'Solucionespb2.',
})

database.connect((err) => {
  if (err) {
    database.end();
    database.destroy();
  };
});

console.log(database);