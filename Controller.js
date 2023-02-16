const { codeBarGenerator, formatDate } = require('./Helpers');

class Controller {
  trama  = {};
  fields = ['header', 'type', 'serialTerminal', 'codeParking', 'nTerminal', 'arg1', 'arg2'];
  
  constructor (Database) {
    this.Database = Database;
  }

  makeTrama(data) {
    data = data.slice(0, data.indexOf('\\r\\n')) + '\\r\\n';
    const listArgs = data.split(',');
    for (let i  = 0; i < this.fields.length; i++) {
      this.trama[this.fields[i]] = listArgs[i];
    }
  }

  async execute() {
    const database = new this.Database();
    database.init();
    if (this.trama.header !== "HS") return "Command not Found !\r\n";
    switch (this.trama.type) {
      case "10":
        const now = new Date();
        const codeBar = codeBarGenerator(this.trama.nTerminal, now);
        this.trama.arg1 = formatDate(now);
        this.trama.arg2 = codeBar
        const result = await database.insertTicket(this.trama);
        return `SV,${this.trama.type},${result[0].nTicket},${formatDate(now)}\r\n`;
      case "20":
        const query  = await database.searchCMD(this.trama);
        if (query.length === 0) return "Command not Found !\r\n";
        const command = `SV,${this.trama.type},${query[0].id},${query[0].description}\r\n`;
        return command;
      default:
        return "Command not Found !\r\n";
    }
  }
}

exports.Controller = Controller;
