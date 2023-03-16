const { MySQL } = require('../Mysql.js');
// const { Mysql1 } = require('../MysqlV1.js');

class Database extends MySQL {
  constructor() {
    super();
  }
}

exports.Database = Database;
