const { codeBarGenerator, getHourDifference, isExpirate, formatDate, calculateTotal, zeroPad } = require('../Helpers');
const { exec } = require("child_process");

class PlotV2 {
  command = null;
  counter = 0;
  constructor(database) {
    this.database = database;
  }

  makeTrama(line) {
    line = line.toString();
    line = line.slice(0, line.indexOf('\r\n'));
    return line.split(',');
  }

  async execute(trama) {
    let query;
    console.log(trama, "-----", this.counter++);
    if (trama[0] !== "HS") return "SV,0,0,0,\r\n";
    console.log(trama.length);
    if (trama.length < 4) return "SV,0,0,0,\r\n";

    switch (trama[1]) {
      case "10":
        let result;
        let resultexec;
        const now = new Date();
        const codeBar = codeBarGenerator(trama[3], now);
        trama.arg1 = formatDate(now);
        const time = trama.arg1.split(" ")[0];
        const date = trama.arg1.split(" ")[1];
        trama.arg2 = codeBar;
        let place = "Soluciones Plan B";
        if (trama[2] == 12) place = "Ucacue Azogues";
        const listprinter = await this.database.getPrinter(trama[2]);
        const printer = listprinter.find((item) => item.terminal == trama[3]);
        const printerstr = `cd TestImpR2 && java -jar JavaTSP100.jar "${place}" "${time}" "${date}" "${codeBar}" "${printer.name}" "5" "NA" "${printer.xmldoc}.xml" "Entrada Posterior"`; 
        result = await this.database.insertTicket(trama, 0);
        resultexec = new Promise((resolve, reject) => {
          exec(printerstr, (error, stdout, stderr) => {
            console.log("Imprimiendo ticket...");
            if (error)  return resolve(`SV,32,${trama[2]},${trama[3]},1,\r\n`);
            console.log(stderr)
            if (stderr) return resolve (`SV,32,${trama[2]},${trama[3]},2,\r\n`);
            const list = stdout.split("\n");
            if (list[1] == "printer.getRecEmpty() == true\r") {
              console.log("Impresora sin papel");
              this.database.statusPrinter(trama[4], 1);
              return resolve(`SV,32,${trama[2]},${trama[3]},3,\r\n`);
            } else if (list[1] == "printer.getCoverOpen() == true\r") {
              this.database.statusPrinter(trama[4], 1);
              console.log("Tapa abierta");
              return resolve(`SV,32,${trama[2]},${trama[3]},4,\r\n`);
            } else {
              console.log(`Ticket generado exitosamente`);
              this.database.statusPrinter(parseInt(trama[4]), 0);
              return resolve(`SV,${trama[1]},${result[0].nTicket},${trama.arg1},\r\n`);
            }
          });
        });
        return await resultexec;
      case "11":
        trama.arg1 = trama[4].slice(0, 12);
        query = await this.database.findTicket(trama);
        if (query.length === 0) return this.command = `SV,${trama[1]},${trama.arg1},3,\r\n`;
        return this.command = `SV,${trama[1]},${query[0].code},${query[0].state},\r\n`;
      case "12":
        trama.arg1 = trama[4].slice(0, 12);
        query = await this.database.finalizeTicket(trama);
      case "13":
        trama.arg1 = trama[4].slice(0, 12);
        query = await this.database.getStateTicket(trama);
        if (query.length === 0) return this.command = `SV,${trama[1]},${trama.arg1},4,\r\n`;
        return this.command = `SV,${trama[1]},${query[0].code},${query[0].state},\r\n`;
      case "20":
        console.log("Here I am ....");
        let query = await this.database.searchCMD(trama);
        if (query.length === 0) return "SV,0,0,0,\r\n";
        return this.command = `SV,${trama[1]},${query[0].id},${query[0].description},\r\n`;
      case "21":
        query = await this.database.updateCMD(trama);
        return "SV,0,0,0,\r\n";
      case "30":
        if (trama[4] === '0x16') {
          process.env.PRINTER = true;
          process.env.PRINTER_CODE = 'Ok';
        } else if (trama[4] === '0x1e') {
          process.env.PRINTER = false;
          process.env.PRINTER_CODE = 'Tapa abierta';
        }
        return this.command = 'exitoso';
      case "40":
        this.status;
        this.since;
        this.to;
        query = await this.database.readTag(trama);
        if (query.length === 0) {
          this.status = 2;
        } else {
          this.since = new Date(query[0].since);
          this.to = new Date(query[0].to);
          if (query[0].type === "m") {
            if (isExpirate(this.since, this.to)) {
              query = await this.database.updateTag(1, trama);
              this.status = 1;
            } else {
              this.status = query[0].status
            }
          } else if (query[0].type === "ps") {
            if (query[0].saldo <= 0) {
              await this.database.updateTag(6, trama);
              this.status = 1;
            }  else {
              this.status = query[0].status
            }
          } else if (query[0].type == "ad") {
            this.status = 0;
          }
        }
        return this.command = `SV,40,${trama[2]},${trama[3]},${trama[4]},${this.status},\r\n`;
      case "41":
        this.status;
        this.since;
        this.to;
        query = await this.database.readTag(trama);
        if (query.length === 0) {
          this.status = 2;
        } else {
          this.since = new Date(query[0].since);
          this.to = new Date(query[0].to);
          if (query[0].type === "m") {
            if (isExpirate(this.since, this.to)) {
              query = await this.database.updateTag(1, trama);
              this.status = 1;
            } else {
              this.status = query[0].status
            }
          } else if (query[0].type === "ps") {
            const tariffs = await this.database.getTariffs(trama);
            const fractions = await this.database.getFractions(tariffs[0].code_fraction);
            tariffs[0].f = fractions;
            query[0].out = formatDate(new Date());
            const total = calculateTotal(query[0], tariffs, "4");
            const saldo = query[0].saldo - total;
            if (saldo > 0) {
              this.status = 0;
            } else {
              this.status = 1;
            }
            await this.database.updateSaldo(1, query[0].id, saldo);


            if (query[0].saldo > 0) {
              this.status = query[0].status
              const minutes = getHourDifference(since, to);
              console.log(query, minutes);
            }
          } else if (query[0].type == "ad") {
            this.status = 6;
          }
        }
        return this.command = `SV,41,${trama[2]},${trama[3]},${trama[4]},${this.status},\r\n`;
      case "60":
        this.status;
        this.since;
        this.to;
        trama[4] = zeroPad(parseInt(trama[4]), 10);
        query = await this.database.readCard(trama);
        if (query.length === 0) {
          this.status = 3;
        } else {
          this.since = new Date(query[0].in);
          this.to = new Date(query[0].out);
          if (query[0].type === "m") {
            if (isExpirate(this.since, this.to)) {
              await this.database.updateCard(6, trama);
              this.status = 6;
            } else {
              this.status = 5;
            }
          } else if (query[0].type == "ps") {
            if (query[0].saldo <= 0) {
              await this.database.updateCard(6, trama);
              this.status = 6;
            } else {
              this.status = query[0].status;
            }
          } else if (query[0].type == "ad") {
            this.status = 6;
          }
        }
        return this.command = `SV,60,${trama[2]},${trama[3]},${trama[4]},${this.status},\r\n`;
      case "61":
        this.status;
        this.since;
        this.to;
        query[4] = zeroPad(parseInt(query[4]), 3);
        query = await this.database.readCard(trama);
        if (query.length === 0) {
          this.status = 3;
        } else {
          this.since = new Date(query[0].in);
          this.to = new Date(query[0].out);
          if (query[0].type === "m") {
            if (isExpirate(this.since, this.to)) {
              query = await this.database.updateCard(6, trama);
              this.status = 6;
            } else {
              this.status = query[0].status;
              // await this.database.logCard([query[0].id,
              //   query[0].code,
              //   query[0].since,
              //   query[0].to,
              //   2,
              //   0,
              //   0,
              //   0
              // ]
            }
          } else if (query[0].type === "ps") {
            const tariffs = await this.database.getTariffs(trama);
            const fractions = await this.database.getFractions(tariffs[0].code_fraction);
            tariffs[0].f = fractions;
            query[0].out = formatDate(new Date());
            const total = calculateTotal(query[0], tariffs, "4");
            const saldo = query[0].saldo - total;
            if (saldo > 0) {
              this.status = 5;
            } else {
              this.status = 6;
            }
            await this.database.updateSaldo(2, query[0].id, saldo);
          } else if (query[0].type == "ad") {
            this.status = 6;
          }
        }
        return this.command = `SV,61,${trama[2]},${trama[3]},${trama[4]},${this.status},\r\n`;
      default:
        return "Command not Found !\r\n";
    }
  }

  showTrama(trama) {
    console.log(trama.join(','));
  }
}

exports.PlotV2 = PlotV2;
