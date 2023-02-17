const Mysql = require('mysql2');
const { formatDate, addMinutes } = require('./Helpers');

class Database {
  init() {
    this.database = Mysql.createConnection({
      host: '192.168.0.223',
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

  updateCMD(trama) {
    this.database.connect((err) => {
      if (err) throw err;
    });
    const args =  [trama.arg1];
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_updateCMD(?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
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

  findTicket(trama) {
    this.database.connect((err) => {
      if (err) throw err;
    });
    console.log(trama)
    const args = [trama.arg1];
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_findTicket(?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result[0]);
      });
      this.database.end();
    });
  }

  finalizeTicket(trama) {
    this.database.connect((err) => {
      if (err) throw err;
    });
    console.log(trama)
    const now = new Date();
    const args = [trama.args1, formatDate(now), formatDate(addMinutes(now)), 3];
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_finalizeTicket(?,?,?,?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result[0]);
      });
      this.database.end();
    });
  }
}

exports.Database = Database;