const Mysql = require('mysql2');

class Database {
  init() {
    this.database = Mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'sch_spbmaxweb',
      password: 'Solucionespb2.',
    });
  }

  updateTicket(args) {
    this.database.connect((err) => {
      if (err) throw err;
    });
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_ti_finalize(?, ?, ?, ?, ?, ?);', args, (err, result, fields) => {
        console.log(result);
        if (err) reject(err);
        resolve(result);
        this.database.end();
      });
    });
  }

  getTicket(id) {
    this.database.connect((err) => {
      if (err) throw err;
    });
    const args = [id];
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_ti_search(?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result[0]);
        this.database.end();
      });
    })
  }

  insertTicket(trama) {
    this.database.connect((err) => {
      if (err) throw err;
    });
    const args =  [1, trama.nTerminal, trama.arg1, trama.arg2, trama.codeParking];
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_controler_v1(?,?,?,?,?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result[0]);
        this.database.end();
      });
    })
  }

  searchCMD(trama) {
    this.database.connect((err) => {
      if (err) throw err;
    });
    const args =  [2, trama.nTerminal, trama.args1,  trama.arg2, trama.codeParking];
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_controler_v1(?,?,?,?,?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result[0]);
      });
      this.database.end();
    });
  }
}

exports.Database = Database;