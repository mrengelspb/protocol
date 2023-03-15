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
          return `SV,10,0,${formatDate(now)},0,\r\n`;
        } else {
          place = Math.floor(Math.random() * Math.floor(freePlaces.length));
          this.database.updatePlaceStatus(freePlaces[place].number);
          result = await this.database.insertTicket(this.trama, freePlaces[place].number);
        }
        return `SV,${this.trama[1]},${result[0].nTicket},${formatDate(now)},${freePlaces[place].number},\r\n`;
      case "11":
        this.trama.arg1 = this.trama[4].slice(0, 12);
        this.query = await this.database.findTicket(this.trama);
        if (this.query.length === 0) return this.command = `SV,${this.trama[1]},${this.trama.arg1},3,\r\n`;
        return this.command = `SV,${this.trama[1]},${this.query[0].code},${this.query[0].state},\r\n`;
      case "12":
        this.trama.arg1 = this.trama[4].slice(0, 12);
        this.query = await this.database.finalizeTicket(this.trama);
      case "20":
        this.trama.arg1 = "2020-10-10 20:39:21";
        this.trama.arg2 = "123456789123";
        this.query = await this.database.searchCMD(this.trama);
        if (this.query.length === 0) return "SV,0,0,0,\r\n";
        return this.command = `SV,${this.trama[1]},${this.query[0].id},${this.query[0].description},\r\n`;
      case "21":
        this.query = await this.database.updateCMD(this.trama);
        return this.command = 'exitoso';
      case "30":
        if (this.trama[4] === '0x16') {
          process.env.PRINTER = true;
          process.env.PRINTER_CODE = 'Ok';
        } else if (this.trama[4] === '0x1e') {
          process.env.PRINTER = false;
          process.env.PRINTER_CODE = 'Tapa abierta';
        }
        return this.command = 'exitoso';
      default:
        return "Command not Found !\r\n";
    }
  }
  
  showTrama() {
    return this.trama.join(',');
  }
}

exports.PlotV2 = PlotV2;
