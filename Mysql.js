const Mysql = require('mysql2');

class Database {
  init() {
    this.database = Mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'sch_spbfaraday',
      password: 'Solucionespb2.',
    });
  }

  spacesTicket() {
    this.database.connect((err) => {
      if (err) throw err;
    });
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_ti_spaces();', (err, result, fields) => {
        if (err) reject(err);
        resolve(result[0]);
        this.database.end();
      });
    });
  }

  updateTicket(args) {
    this.database.connect((err) => {
      if (err) throw err;
    });
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_ti_finalize(?, ?, ?, ?, ?, ?);', args, (err, result, fields) => {
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
      this.database.query('CALL pa_controller_v1(?,?,?,?,?);', args, (err, result, fields) => {
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
      this.database.query('CALL pa_controller_v1(?,?,?,?,?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result[0]);
      });
      this.database.end();
    });
  }


  insertCommand(nterminal, command, status, id_parking) {
    this.database.connect((err) => {
      if (err) throw err;
    });
    const args =  [nterminal, command, status, id_parking];
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_insertCommand(?,?,?,?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result[0]);
      });
      this.database.end();
    });
  }

  loadController() {
    this.database.connect((err) => {
      if (err) throw err;
    });
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_ct_load();', (err, result, fields) => {
        if (err) reject(err);
        resolve(result[0]);
      });
      this.database.end();
    });
  }
}

exports.Database = Database;