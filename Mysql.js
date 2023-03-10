const Mysql = require('mysql2');
const { formatDate, addMinutes, getHourDifference } = require('./Helpers');

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
      if (err) console.log(err);
    });
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_ti_spaces();', (err, result, fields) => {
        if (err) {
          console.log(err);
        } else {
          resolve(result[0]);
        }
        this.database.end();
      });
    });
  }

  updateTicket(args) {
    this.database.connect((err) => {
      if (err) console.log(err);
    });
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_ti_finalize(?, ?, ?, ?, ?, ?);', args, (err, result, fields) => {
        if (err) reject(err);
        console.log(result)
        resolve(result);
        this.database.end();
      });
    });
  }

  getTicket(id) {
    this.database.connect((err) => {
      if (err) console.log(err);
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
      if (err) console.log(err);
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
      if (err) console.log(err);
    });
    const args =  [2, trama.nTerminal, trama.args1,  trama.arg2, trama.codeParking];
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_controller_v1(?,?,?,?,?);', args, (err, result, fields) => {
        if (err) {
          console.log(err);
        } else {
          resolve(result[0]);
        }
      });
      this.database.end();
    });
  }

  updateCMD(trama) {
    this.database.connect((err) => {
      if (err) console.log(err);
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
      if (err) console.log(err);
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
      if (err) console.log(err);
    });
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_ct_load();', (err, result, fields) => {
        if (err) reject(err);
        if (result[0].length > 0) {
          resolve(result[0]);
        } else {
          resolve([]);
        }
      });
      this.database.end();
    });
  }

  findTicket(trama) {
    this.database.connect((err) => {
      if (err) console.log(err);
    });
    const args = [trama.arg1];
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_findTicket(?);', args, (err, result, fields) => {
        if (err) reject(err);
        if (result[0].length > 0) {
          const hours = getHourDifference(new Date(result[0].in, new Date()));
          // result[0].time = hours;
          if (hours > 2) result[0].state = 2;
          console.log(result[0], hours);
          resolve(result[0]);
        } else {
          resolve([]);
        }
      });
      this.database.end();
    });
  }

  finalizeTicket(trama) {
    this.database.connect((err) => {
      if (err) console.log(err);
    });
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

  status() {
    return new Promise((resolve, reject) => {
      this.database.ping((err) => {
        if (err) {
          resolve({ db: false });
        } else {
          resolve({ db: true });
        }
      });
      this.database.end();
    });
  }

  getPlacesfree(status) {
    this.database.connect((err) => {
      if (err) console.log(err);
    });
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_place_status(?);', [status], (err, result, fields) => {
        if (err) console.log(err);
        // fix;
        resolve(result[0]);
      });
      this.database.end();
    });
  }

  getPlacesBySection() {
    this.database.connect((err) => {
      if (err) console.log(err);
    });
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_place_section();', (err, result, fields) => {
        if (err) console.log(err);
        resolve(result[0]);
      });
      this.database.end();
    });
  }

  updatePlaceStatus(number, status) {
    this.database.connect((err) => {
      if (err) console.log(err);
    });
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_place_update(?, ?);', [number, status], (err, result, fields) => {
        if (err) console.log(err);
        resolve(result);
      });
      this.database.end();
    });
  }
}

exports.Database = Database;