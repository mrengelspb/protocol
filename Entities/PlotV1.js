class PlotV1 {
    trama  = {};
    fields = ['header', 'type', 'serialTerminal', 'codeParking', 'nTerminal', 'arg1', 'arg2'];

    constructor(data, connection) {
        this.connection = connection;
        data = data.slice(0, data.indexOf('\\r\\n')) + '\\r\\n';
        const listArgs = data.split(',');
        for (let i  = 0; i < this.fields.length; i++) {
          this.trama[this.fields[i]] = listArgs[i];
        }
    }

    async execute() {
      let query = null;
      let command = null;
  
      if (this.trama.header !== "HS") return "SV,0,0,0,\r\n";
  
      switch (this.trama.type) {
        case "10":
          const now = new Date();
          const codeBar = codeBarGenerator(this.trama.nTerminal, now);
          this.trama.arg1 = formatDate(now);
          this.trama.arg2 = codeBar;
          let freePlaces = await this.connection.getPlacesfree(0);
          let place;
          let result;
          if (freePlaces == 0) {
            freePlaces = [{ number: 0 }];
            place = 0;
          } else {
            place = Math.floor(Math.random() * Math.floor(freePlaces.length));
            this.connection.updatePlaceStatus(freePlaces[place].number);
            result = await this.connection.insertTicket(this.trama, freePlaces[place].number);
          }
          return `SV,${this.trama.type},${result[0].nTicket},${formatDate(now)},${freePlaces[place].number},\r\n`;
        case "11":
          this.trama.arg1 = this.trama.arg1.slice(0, 12);
          query = await this.connection.findTicket(this.trama);
          if (query.length === 0) return command = `SV,${this.trama.type},${this.trama.arg1},3,\r\n`;
          return command = `SV,${this.trama.type},${query[0].code},${query[0].state},\r\n`;
        case "12":
          this.trama.arg1 = this.trama.arg1.slice(0, 12);
          query = await this.connection.finalizeTicket(this.trama);
        case "20":
          this.trama.arg1 = "2020-10-10 20:39:21";
          this.trama.arg2 = "123456789123";
          query = await this.connection.searchCMD(this.trama);
          if (query.length === 0) return "SV,0,0,0,\r\n";
          command = `SV,${this.trama.type},${query[0].id},${query[0].description},\r\n`;
          return command;
        case "21":
          query = await this.connection.updateCMD(this.trama);
          command = 'exitoso';
          console.log("CMD recepcion Exitosa.");
          return command;
        case "30":
          if (this.trama.arg1 === '0x16') {
            process.env.PRINTER = true;
            process.env.PRINTER_CODE = 'Ok';
          } else if (this.trama.arg1 === '0x1e') {
            process.env.PRINTER = false;
            process.env.PRINTER_CODE = 'Tapa abierta';
          }
          command = 'exitoso';
          return command;
        default:
          return "Command not Found !\r\n";
      }
    }
  }
  
  exports.PlotV1 = PlotV1;