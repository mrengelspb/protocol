class Controller {
  trama  = {};
  fields = ['header', 'type', 'serialTerminal', 'codeParking', 'nTerminal', 'arg1', 'arg2'];
  
  constructor (Database) {
    this.Database = Database;
  }

  makeTrama(data) {
    const listArgs = data.split(',');
    console.log(listArgs);
    if (listArgs[listArgs.length - 1] !== '\\r\\n\n') {
      console.log("Encolamiendo de varias tramas !");
    }
    for (let i  = 0; i < this.fields.length; i++) {
      if (listArgs[i] !== '\r\n') {
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
      case "10": return await database.insertTicket(this.trama);
      case "20": return await database.searchCMD(this.trama);
      default:
        console.log("Command not Found !");
        return "Command not Found !";
    }
  }
}

exports.Controller = Controller;
    
// scv = trama;
// nticket = listArgs[5];
// dateIn = listArgs[4];
// nterminal = parseInt(listArgs[3]);
    // const list_trama = data.split(',');
            // const command = list_trama[0];
            // const type = list_trama[1];
            // if (command === 'HS' && type === '10') {
            //   insertTicket(data, database);
            // } else if (command === 'HS' && type === '10') {
            //   command(data, database);
            // }
