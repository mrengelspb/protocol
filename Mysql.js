const Mysql = require('mysql2');
const { formatDate, addMinutes, getHourDifference } = require('./Helpers');

class Database {
  constructor () {
    if (Database._instance) {
      return Database._instance;
    }
    Database._instance = this;
  }
  init() {
    this.database = Mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'sch_spbfaraday',
      password: 'root',
    });
    this.database.connect((err) => {
      console.log(err);
    });
  }

  spacesTicket() {
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_ti_spaces();', (err, result, fields) => {
        if (err) {
          console.log(err);
        } else {
          resolve(result[0]);
        }
      });
    
    });
  }

  updateTicket(args) {
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_ti_finalize(?, ?, ?, ?, ?, ?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
    
    });
  }

  getTicket(id) {
    const args = [id];
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_ti_search(?);', args, (err, result, fields) => {
        if (err) console.log(err);
        resolve(result[0]);
      });
    
    })
  }

  insertTicket(trama, place) {
    const args =  [1, trama.nTerminal, trama.arg1, trama.arg2, trama.codeParking, place];
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_controller_v2(?,?,?,?,?,?);', args, (err, result, fields) => {
        if (err) console.log(err);
        resolve(result[0]);
      });
    
    })
  }

  searchCMD(trama) {
    const args =  [2, trama.nTerminal, trama.arg1,  trama.arg2, trama.codeParking];
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_controller_v1(?,?,?,?,?);', args, (err, result, fields) => {
        if (err) {
          console.log(err);
        } else {
          resolve(result[0]);
        }
      });
    
    });
  }

  updateCMD(trama) {
    const args =  [trama.arg1];
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_updateCMD(?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
    
    });
  }


  insertCommand(nterminal, command, status, id_parking) {
    const args =  [nterminal, command, status, id_parking];
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_insertCommand(?,?,?,?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result[0]);
      });
    
    });
  }

  loadController() {
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_ct_load();', (err, result, fields) => {
        if (err) reject(err);
        if (result[0].length > 0) {
          resolve(result[0]);
        } else {
          resolve([]);
        }
      });
    
    });
  }

  findTicket(trama) {
    const args = [trama.arg1];
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_findTicket(?);', args, (err, result, fields) => {
        if (err) reject(err);
        if (result[0].length > 0) {
          const hours = getHourDifference(new Date(result[0].in, new Date()));
          result[0].time = hours;
          if (hours > 2) {
            result[0].state = 2
          } else {
            result[0].state = 1
          }
          resolve(result[0]);
        } else {
          resolve([]);
        }
      });
    
    });
  }

  finalizeTicket(trama) {
    const now = new Date();
    const args = [trama.arg1, formatDate(now), formatDate(addMinutes(now, 10)), 3];
    console.log(args)
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_finalizeTicket(?,?,?,?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
    
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
    
    });
  }

  getPlacesfree(status) {
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_place_status(?);', [status], (err, result, fields) => {
        if (err) console.log(err);
        resolve(result[0])
      });
    
    });
  }

  getPlacesBySection() {
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_place_section();', (err, result, fields) => {
        if (err) console.log(err);
        resolve(result[0]);
      });
    
    });
  }

  updatePlaceStatus(number) {
    return new Promise((resolve, reject) => {
      this.database.query('CALL pa_place_update(?);', [number], (err, result, fields) => {
        if (err) console.log(err);
        resolve(result);
      });
    
    });
  }
}
const database = new Database();
database.init();
exports.database = database;