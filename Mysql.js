const Mysql = require('mysql2');
const { formatDate, addMinutes, getHourDifference } = require('./Helpers');

class MySQL {
  open() {
    this.connection = Mysql.createConnection({
      host: '104.196.154.200',
      user: 'uspb-cimax01',
      database: 'sch_spbmaxweb',
      password: 'Solucionespb1.', // root
    });
    // this.connection = Mysql.createConnection({
    //   host: '34.75.110.6',
    //   user: 'uspb-max01',
    //   database: 'sch_spbmaxweb',
    //   password: 'Solucionespb2.', // root
    // });
    this.connection.connect((err) => {
      if (err) console.log(err);  
    });
  }

  close() {
    this.connection.end();
  }

  spacesTicket() {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_ti_spaces();', (err, result, fields) => {
        if (err) {
          console.log(err);
        } else {
          resolve(result[0]);
        }
      });
      this.close();
    });
  }

  updateTicket(args) {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_ti_finalize(?, ?, ?, ?, ?, ?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
      this.close();
    });
  }

  getTicket(id) {
    this.open();
    const args = [id];
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_ti_search(?);', args, (err, result, fields) => {
        if (err) console.log(err);
        resolve(result[0]);
      });
    this.close();
    })
  }

  insertTicket(trama, place) {
    this.open();
    const args =  [1, trama[3], trama.arg1, trama.arg2, trama[2], place, 13];
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_controller_v2(?,?,?,?,?,?,?);', args, (err, result, fields) => {
        if (err) console.log(err);
        resolve(result[0]);
      });
    this.close();
    })
  }

  searchCMD(trama) {
    this.open();
    const args =  [2, trama[3], trama.arg1 || "2020-10-10 20:39:21",  trama.arg2 || "123456789123", trama[2]];
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_controller_v1(?,?,?,?,?);', args, (err, result, fields) => {
        if (err) {
          console.log(err);
        } else {
          resolve(result[0]);
        }
      });
      this.close();
    });
  }

  updateCMD(trama) {
    this.open();
    const args =  [trama[4]];
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_updateCMD(?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
      this.close();
    });
  }

  insertCommand(nterminal, command, status, id_parking) {
    this.open();
    const args =  [nterminal, command, status, id_parking];
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_insertCommand(?,?,?,?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result[0]);
      });
      this.close();
    });
  }

  loadController() {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_ct_load();', (err, result, fields) => {
        if (err) reject(err);
        if (result[0].length > 0) {
          resolve(result[0]);
        } else {
          resolve([]);
        }
      });
      this.close();
    });
  }

  findTicket(trama) {
    const args = [trama.arg1];
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_findTicket(?);', args, (err, result, fields) => {
        if (err) console.log(err);
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
    this.close();
    });
  }

  finalizeTicket(trama) {
    const now = new Date();
    const args = [trama.arg1, formatDate(now), formatDate(addMinutes(now, 10)), 3];
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_finalizeTicket(?,?,?,?);', args, (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
      this.close();
    });
  }

  status() {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.ping((err) => {
        if (err) {
          resolve({ db: false });
        } else {
          resolve({ db: true });
        }
      });
      this.close();
    });
  }

  getPlacesfree(status) {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_place_status(?);', [status], (err, result, fields) => {
        if (err) console.log(err);
        resolve(result[0])
      });
    this.close();
    });
  }

  getPlacesBySection() {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_place_section();', (err, result, fields) => {
        if (err) console.log(err);
        resolve(result[0]);
      });
    this.close();
    });
  }

  updatePlaceStatus(number) {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_place_update(?);', [number], (err, result, fields) => {
        if (err) console.log(err);
        resolve(result);
      });
    this.close();
    });
  }
  
  updateTag(status, trama) {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_tag_status(?, ?, ?);', [status, trama[4], formatDate(new Date())], (err, result, fields) => {
        if (err) console.log(err);
        resolve(result);
      });
    this.close();
    });
  }

  readTag(trama) {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_tag_get(?);', [trama[4]], (err, result, fields) => {
        if (err) console.log(err);
        resolve(result[0]);
      });
    this.close();
    });
  }

  readCard(trama) {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_card_get(?);', [trama[4]], (err, result, fields) => {
        if (err) console.log(err);
        resolve(result[0]);
      });
    this.close();
    });
  }

  getTariffs(trama) {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_pt_getTariff(?);', [trama[2]], (err, result, fields) => {
        if (err) console.log(err);
        resolve(result[0]);
      });
    this.close();
    });
  }

  getFractions(code) {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_pt_getFraction(?);', [code], (err, result, fields) => {
        if (err) console.log(err);
        resolve(result[0]);
      });
    this.close();
    });
  }

  getStateTicket(trama) {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_tk_getTicketState(?, ?);', [trama.arg1, 2], (err, result, fields) => {
        if (err) console.log(err);
        resolve(result[0]);
      });
    this.close();
    });
  }

  updateCard(state, trama) {
    const now = new Date();
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_card_status(?, ?, ?);', [state, trama[4], formatDate(now)], (err, result, fields) => {
        if (err) console.log(err);
        resolve(result);
      });
    this.close();
    });
  }

  updateSaldo(type, id, saldo) {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_saldo(?, ?, ?);', [type, id, saldo], (err, result, fields) => {
        if (err) console.log(err);
        resolve(result);
      });
    this.close();
    });
  }

  logCard(type, args) {
    this.open();
    return new Promise((resolve, reject) => {
      if (type == "in") {
        this.connection.query('CALL pa_prepay_logIn(?,?,?,?,?,?,?);', [args], (err, result, fields) => {
          if (err) console.log(err);
          resolve(result);
        });
      } else if (type == "out") {
        this.connection.query('CALL pa_prepay_logOut(?,?,?,?,?,?,?,?,?,?);', [args], (err, result, fields) => {
          if (err) console.log(err);
          resolve(result);
        });
      }
    this.close();
    });
  }

  statusPrinter(nterminal, state) {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_printer_status(?,?);', [nterminal, state], (err, result, fields) => {
        if (err) console.log(err);
        resolve(result);
      });
    this.close();
    });
  }

  getPrinter(parking) {
    this.open();
    return new Promise((resolve, reject) => {
      this.connection.query('CALL pa_printer_get(?);', [parking], (err, result, fields) => {
        if (err) console.log(err);
        resolve(result[0]);
      });
    this.close();
    });
  }
}

exports.MySQL = MySQL;
