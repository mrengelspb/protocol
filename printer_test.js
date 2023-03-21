const { codeBarGenerator, getHourDifference, isExpirate, formatDate, calculateTotal } = require('./Helpers');
const { exec } = require("child_process");

const now = new Date();
const codeBar = codeBarGenerator(1, now);
const format_date = formatDate(now);
const time = format_date.split(" ")[0];
const date = format_date.split(" ")[1];

const printerstr = `cd TestImpR2 && java -jar JavaTSP100.jar "UCACUE" "${time}" "${date}" "${codeBar}" "TSP_OF_1_1" "100" "NA" "jposOF_JS.xml" "Entrada Posterior"`; 
exec(printerstr, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    const list = stdout.split("\n");
    if (list[1] == "printer.getRecEmpty() == true\r") {
        console.log("Impresora sin papel");
    } else if (list[1] == "printer.getCoverOpen() == true\r") {
        console.log("Tapa abierta");
    } else {
        console.log(`stdout: ${stdout}`);
    }
});