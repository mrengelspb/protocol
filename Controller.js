class Controller {
  trama  = {};
  fields = ['header', 'type', 'serialTerminal', 'codeParking', 'nTerminal', 'arg1', 'arg2'];
  
  constructor (Database) {
    this.Database = Database;
  }

  makeTrama(data) {
    const listArgs = data.split(',');
    if (listArgs[listArgs.length - 1] !== '\\r\\n\n') {
      console.log("Encolamiendo de varias tramas !");
    }
    for (let i  = 0; i < this.fields.length; i++) {
      if (listArgs[i] !== '\\r\\n\n') {
        this.trama[this.fields[i]] = listArgs[i];
      } else {
        this.trama[this.fields[i]] = null;
      }
    }
  }

  async execute() {
    const database = new this.Database();
    database.init();
    switch (this.trama.type) {
      case "10":
        const result = await database.insertTicket(this.trama);
        return `${result[0].nTicket}\r\n`;
      case "20":
        const query  = await database.searchCMD(this.trama);
        const command = `${query[0].id},${query[0].description}\r\n`;
        return command;
      default:
        console.log("Command not Found !");
        return "Command not Found !\r\n";
    }
  }
}

exports.Controller = Controller;
