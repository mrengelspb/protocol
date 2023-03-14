const { MySQL } = require('../Mysql.js');

class Database extends MySQL {
  constructor() {
    super();
  }
}

exports.Database = Database;
