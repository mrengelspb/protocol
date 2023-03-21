const { codeBarGenerator, getHourDifference, isExpirate, formatDate, calculateTotal } = require('../Helpers');
const { exec } = require("child_process");

class PlotV2 {
  query = null;
  command = null;
  trama = null;

  constructor(database) {
    this.database = database;
  }

  makeTrama(line) {
    line = line.toString();
    line = line.slice(0, line.indexOf('\r\n'));
    this.trama = line.split(',');
    console.log(this.trama);
  }

  async execute() {
    if (this.trama[0] !== "HS") return "SV,0,0,0,\r\n";

    switch (this.trama[1]) {
      case "10":
        let result;
        const now = new Date();
        const codeBar = codeBarGenerator(this.trama[3], now);
        this.trama.arg1 = formatDate(now);
        const time = this.trama.arg1.split(" ")[0];
        const date = this.trama.arg1.split(" ")[1];
        this.trama.arg2 = codeBar;
        let place = "Soluciones Plan B";
        if (this.trama[2] == 12) place = "Ucacue Azogues";
        result = await this.database.insertTicket(this.trama, 0);
        const printerstr = `cd TestImpR2 && java -jar JavaTSP100.jar "${place}" "${time}" "${date}" "${codeBar}" "TSP_OF_1_1" "5" "NA" "jposOF_1.xml" "Entrada Posterior"`; 
        exec(printerstr, async (error, stdout, stderr) => {
          if (error)  return  `SV,32,${this.trama[2]},${this.trama[3]},1,\r\n`;
          if (stderr) return `SV,32,${this.trama[2]},${this.trama[3]},1,\r\n`;
          const list = stdout.split("\n");
          if (list[1] == "printer.getRecEmpty() == true\r") {
            console.log("Impresora sin papel");
            await this.database.statusPrinter(this.trama[4], 1);
            return `SV,32,${this.trama[2]},${this.trama[3]},1,\r\n`;
          } else if (list[1] == "printer.getCoverOpen() == true\r") {
            await this.database.statusPrinter(this.trama[4], 1);
            console.log("Tapa abierta");
            return `SV,32,${this.trama[2]},${this.trama[3]},1,\r\n`;
          } else {
            console.log(`Ticket generado exitosamente`);
            await this.database.statusPrinter(this.trama[4], 0);
            return `SV,${this.trama[1]},${result[0].nTicket},${formatDate(now)},\r\n`;
          }
        });
      case "11":
        this.trama.arg1 = this.trama[4].slice(0, 12);
        this.query = await this.database.findTicket(this.trama);
        if (this.query.length === 0) return this.command = `SV,${this.trama[1]},${this.trama.arg1},3,\r\n`;
        return this.command = `SV,${this.trama[1]},${this.query[0].code},${this.query[0].state},\r\n`;
      case "12":
        this.trama.arg1 = this.trama[4].slice(0, 12);
        this.query = await this.database.finalizeTicket(this.trama);
      case "13":
        this.trama.arg1 = this.trama[4].slice(0, 12);
        this.query = await this.database.getStateTicket(this.trama);
        if (this.query.length === 0) return this.command = `SV,${this.trama[1]},${this.trama.arg1},4,\r\n`;
        return this.command = `SV,${this.trama[1]},${this.query[0].code},${this.query[0].state},\r\n`;
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
      case "40":
        this.status;
        this.since;
        this.to;
        this.query = await this.database.readTag(this.trama);
        if (this.query.length === 0) {
          this.status = 2;
        } else {
          this.since = new Date(this.query[0].since);
          this.to = new Date(this.query[0].to);
          if (this.query[0].type === "m") {
            if (isExpirate(this.since, this.to)) {
              this.query = await this.database.updateTag(1, this.trama);
              this.status = 1;
            } else {
              this.status = this.query[0].status
            }
          } else if (this.query[0].type === "ps") {
            if (this.query[0].saldo <= 0) {
              await this.database.updateTag(6, this.trama);
              this.status = 1;
            }  else {
              this.status = this.query[0].status
            }
          } else if (this.query[0].type == "ad") {
            this.status = 0;
          }
        }
        return this.command = `SV,40,${this.trama[2]},${this.trama[3]},${this.trama[4]},${this.status},\r\n`;
      case "41":
        this.status;
        this.since;
        this.to;
        this.query = await this.database.readTag(this.trama);
        if (this.query.length === 0) {
          this.status = 2;
        } else {
          this.since = new Date(this.query[0].since);
          this.to = new Date(this.query[0].to);
          if (this.query[0].type === "m") {
            if (isExpirate(this.since, this.to)) {
              this.query = await this.database.updateTag(1, this.trama);
              this.status = 1;
            } else {
              this.status = this.query[0].status
            }
          } else if (this.query[0].type === "ps") {
            const tariffs = await this.database.getTariffs(this.trama);
            const fractions = await this.database.getFractions(tariffs[0].code_fraction);
            tariffs[0].f = fractions;
            this.query[0].out = formatDate(new Date());
            const total = calculateTotal(this.query[0], tariffs, "4");
            const saldo = this.query[0].saldo - total;
            if (saldo > 0) {
              this.status = 0;
            } else {
              this.status = 1;
            }
            await this.database.updateSaldo(1, this.query[0].id, saldo);


            if (this.query[0].saldo > 0) {
              this.status = this.query[0].status
              const minutes = getHourDifference(since, to);
              console.log(this.query, minutes);
            }
          } else if (this.query[0].type == "ad") {
            this.status = 6;
          }
        }
        return this.command = `SV,41,${this.trama[2]},${this.trama[3]},${this.trama[4]},${this.status},\r\n`;
      case "60":
        this.status;
        this.since;
        this.to;
        this.query = await this.database.readCard(this.trama);
        if (this.query.length === 0) {
          this.status = 3;
        } else {
          this.since = new Date(this.query[0].in);
          this.to = new Date(this.query[0].out);
          if (this.query[0].type === "m") {
            if (isExpirate(this.since, this.to)) {
              await this.database.updateCard(6, this.trama);
              this.status = 6;
            } else {
              this.status = 5;
            }
          } else if (this.query[0].type == "ps") {
            if (this.query[0].saldo <= 0) {
              await this.database.updateCard(6, this.trama);
              this.status = 6;
            } else {
              this.status = this.query[0].status;
            }
          } else if (this.query[0].type == "ad") {
            this.status = 6;
          }
        }
        return this.command = `SV,60,${this.trama[2]},${this.trama[3]},${this.trama[4]},${this.status},\r\n`;
      case "61":
        this.status;
        this.since;
        this.to;
        this.query = await this.database.readCard(this.trama);
        if (this.query.length === 0) {
          this.status = 3;
        } else {
          this.since = new Date(this.query[0].in);
          this.to = new Date(this.query[0].out);
          if (this.query[0].type === "m") {
            if (isExpirate(this.since, this.to)) {
              this.query = await this.database.updateCard(6, this.trama);
              this.status = 6;
            } else {
              this.status = this.query[0].status;
              // await this.database.logCard([this.query[0].id,
              //   this.query[0].code,
              //   this.query[0].since,
              //   this.query[0].to,
              //   2,
              //   0,
              //   0,
              //   0
              // ]
            }
          } else if (this.query[0].type === "ps") {
            const tariffs = await this.database.getTariffs(this.trama);
            const fractions = await this.database.getFractions(tariffs[0].code_fraction);
            tariffs[0].f = fractions;
            this.query[0].out = formatDate(new Date());
            const total = calculateTotal(this.query[0], tariffs, "4");
            const saldo = this.query[0].saldo - total;
            if (saldo > 0) {
              this.status = 5;
            } else {
              this.status = 6;
            }
            await this.database.updateSaldo(2, this.query[0].id, saldo);
          } else if (this.query[0].type == "ad") {
            this.status = 6;
          }
        }
        return this.command = `SV,61,${this.trama[2]},${this.trama[3]},${this.trama[4]},${this.status},\r\n`;
      default:
        return "Command not Found !\r\n";
    }
  }

  showTrama() {
    return this.trama.join(',');
  }
}

exports.PlotV2 = PlotV2;
