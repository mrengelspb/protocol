const Mysql = require('mysql2');

function Database(configuration) {
    const database = Mysql.createConnection(configuration);
    return database;
}

exports.Database = Database;