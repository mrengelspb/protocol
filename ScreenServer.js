const net = require('net');
const input = process.stdin;

let packet = {
	id_code: ["ff", "ff", "ff", "ff"],
	network_data: [],
	reservation: ["00", "00"],
	type: ["68"],
	card_type: ["32"],
	card_id: ["ff"],
	cmd: ["74"],
	aditional_information: ["11"],
	info: ["00", "00", "00", "00", "26", "00", "77", "00", "98", "03", "00", "00", "00", "00", "00"
			, "60", "00", "10", "12", "00", "00", "00", "00", "00", "00", "03", "00", "10"],
	content: [],
	checksum: ["", ""]
}

input.setEncoding('UTF-8');
input.on('data', function(line){
	const keys = line.split(",");
	let buf = Buffer.from(keys[1]);
	let data = new Uint8Array(buf);
	packet.content = data;
	let len = packet.reservation.length + packet.type.length
	+ packet.card_type.length + packet.card_id.length + packet.aditional_information.length
	+ packet.cmd.length + packet.info.length + packet.content.length;
	packet.network_data.push(len.toString(16));
	packet.network_data.push("00");
	let checksum = 0;
	for (let key in packet) {
		if (key !== "content" && key !== "checksum") {
			let str = packet[key].join("");
			packet[key] = new Uint8Array(Buffer.from(str, "hex"));
			if (key !== "id_code" && key !== "network_data" && key !== "reservation") {
				checksum += packet[key].reduce((total, num) => {return total + num});
			}
		} else {
			if (key === "content") {
				checksum += packet[key].reduce((total, num) => {return total + num});
			}
		}
	
	}
	console.log(((checksum)));

	checksum = checksum.toString(2).padStart(16, "0");
	let checksum1 = parseInt(checksum.slice(8, 16), 2);
	let checksum2 =  parseInt(checksum.slice(0, 8), 2);
	console.log((parseInt(checksum)));
	packet.checksum = [checksum1, checksum2];
	
	let trama = [];
	for (let key in packet) {
		if (key !== "checksum") {
			trama = trama.concat(Array.from(packet[key]));
		} else {
			trama = trama.concat(packet[key]);
		}
	}
	const res = Buffer.from(trama);
	const u = new Uint8Array(res);
	console.log("----------------*****");
	console.log(trama);
	console.log("----------------****");

    //quit on ctrl+c
    if(line === '\u0003') process.exit(0);
    client.write(u);
});
// show,Disponibles: 25.,green,
// let trama = ["ff", "ff",
// "ff", "ff", "33", "00", "00", "00", "68", "32", 
// "ff", "74", "11", "00", "00", "00", "00", "26",
// "00", "77", "00", "98", "03", "00", "00", "00", 
// "00", "00", "60", "00", "10", "12", "00", "00",
// "00", "00", "00", "00", "03", "00", "10", "44",
// "69", "73", "70", "6f", "6E", "69", "62", "6C", 
// "65", "73", "3A",  "20", "32", "35", "2E", "56", 
// "09"];




const client = new net.Socket();
client.connect(5200, '192.168.1.222', function() {
	// const buf = Buffer.from(trama.join(""), "hex");
	// const uint8array = new Uint8Array(buf);
	// console.log("----------------");
	// console.log(uint8array);
	// console.log("----------------");
	// client.write(uint8array);
});

client.on('data', function(data) {
	console.log("*****")
    console.log(data);
});

client.on('close', function() {
	console.log('Connection closed');
});