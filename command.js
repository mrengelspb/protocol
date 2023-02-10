function command(trama, database) {
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

  scv = trama;
  listArgs = scv.split(',');
  nticket = listArgs[5];
  dateIn = listArgs[4];
  nterminal = parseInt(listArgs[3]);

  database.query('CALL pa_controler(?,?,?,?);', [1, nterminal, dateIn, nticket], (err, result, fields) => {
    if (err) throw err;
  });

  database.end();
}

exports.insertTicket = insertTicket;
