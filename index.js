/* Protocol Conection */
const { Database } = require('./Mysql');
const process = require('process');

const database = Database({
  host: 'localhost',
  user: 'root',
  database: 'sch_spbmaxweb',
  password: 'Solucionespb2.',
});

let scv;
let listArgs;
let nticket;
let dateIn;
let nterminal;

database.connect((err) => {
  if (err) {
    database.end();
    database.destroy();
  };
});

scv = process.argv[2];
listArgs = scv.split(',');
nticket = listArgs[5];
dateIn = listArgs[4];
nterminal = parseInt(listArgs[3]);

database.query('CALL pa_insert_ticket(?,?,?,?);', [1, nterminal, dateIn, nticket],(err, result, fields) => {
  if (err) throw err;
  console.log(result);
});

database.end();
