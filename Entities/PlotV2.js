const { codeBarGenerator, formatDate } = require('../Helpers');

class PlotV2 {
  query = null;
  command = null;
  trama = null;

  constructor(database) {
    this.database = database;
  }

  makeTrama(line) {
    line = line.toString();
    line = line.slice(0, line.indexOf('\\r\\n')) + '\\r\\n';
    this.trama = line.split(',');
  }

  async execute() {
    if (this.trama[0] !== "HS") return "SV,0,0,0,\r\n";

    switch (this.trama[1]) {
      case "10":
        let place;
        let result;

        const now = new Date();
        const codeBar = codeBarGenerator(this.trama[3], now);
        this.trama.arg1 = formatDate(now);
        this.trama.arg2 = codeBar;
        let freePlaces = await this.database.getPlacesfree(0);
        if (freePlaces == 0) {
          freePlaces = [{ number: 0 }];
          place = 0;
          // return `SV,10,0,${formatDate(now)},0,\r\n`;
        } else {
          place = Math.floor(Math.random() * Math.floor(freePlaces.length));
          this.database.updatePlaceStatus(freePlaces[place].number);
          result = await this.database.insertTicket(this.trama, freePlaces[place].number);
        }
        return `SV,${this.trama[1]},${result[0].nTicket},${formatDate(now)},${freePlaces[place].number},\r\n`;
      // case "11":
      //   this.trama.arg1 = this.trama.arg1.slice(0, 12);
      //   query = await this.database.findTicket(this.trama);
      //   if (query.length === 0) return command = `SV,${this.trama.type},${this.trama.arg1},3,\r\n`;
      //   return command = `SV,${this.trama.type},${query[0].code},${query[0].state},\r\n`;
      // case "12":
      //   this.trama.arg1 = this.trama.arg1.slice(0, 12);
      //   query = await this.database.finalizeTicket(this.trama);
      // case "20":
      //   this.trama.arg1 = "2020-10-10 20:39:21";
      //   this.trama.arg2 = "123456789123";
      //   query = await this.database.searchCMD(this.trama);
      //   if (query.length === 0) return "SV,0,0,0,\r\n";
      //   command = `SV,${this.trama.type},${query[0].id},${query[0].description},\r\n`;
      //   return command;
      // case "21":
      //   query = await this.database.updateCMD(this.trama);
      //   command = 'exitoso';
      //   console.log("CMD recepcion Exitosa.");
      //   return command;
      // case "30":
      //   if (this.trama.arg1 === '0x16') {
      //     process.env.PRINTER = true;
      //     process.env.PRINTER_CODE = 'Ok';
      //   } else if (this.trama.arg1 === '0x1e') {
      //     process.env.PRINTER = false;
      //     process.env.PRINTER_CODE = 'Tapa abierta';
      //   }
      //   command = 'exitoso';
      //   return command;
      default:
        return "Command not Found !\r\n";
    }
  }
  
  showTrama() {
    return this.trama.join(',');
  }
}

exports.PlotV2 = PlotV2;
