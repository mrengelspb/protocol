function screenPrinter(line, color, screen) {
	const net = require('net');
	let ip;
	let panel;
	let coloraux1;
	let coloraux2;

	if (color == "red"){
		coloraux1 = 136;
		coloraux2 = 18;
	}else if(color == "green"){
		coloraux1 = 152;
		coloraux2 = 34;
	}else if(color == "yellow"){
		coloraux1 = 168;
		coloraux2 = 50;
	}
	if (screen == 1) {
		panel = ["35", "64", "35", "33", "30"] //10.10.10.180
		ip = "10.10.10.180";
	} if (screen == 2) {
		panel = ["35", "64", "35", "32", "65"] //10.10.10.181
		ip = "10.10.10.181";
	} if (screen == 3) {
		panel = ["38", "33", "61", "37", "62"] //10.10.10.182
		ip = "10.10.10.182";
	}
	packet = {
		id_code: ["a5", "30", "30", "36", "30",
		"36", "65", "64"
		],
		network_data: panel,
		reservation: ["00"],
		type: ["68"],
		card_type: ["32"],
		card_id: ["ff"],
		cmd: ["74"],
		aditional_information: ["11"],
		info: ["00", "00", "00", "00", "cc1", "00",
				"77", "00", "cc2", "03", "00", "00", "00", "00",
				"00", "60", "00", "10", "cc3", "00",
				"00", "00", "00", "00", "00", "03", "00", "data_length"],
		content: [],
		checksum: ["", ""]
	}
	let buf = Buffer.from(line);
	let data = new Uint8Array(buf);
	packet.info[4] = data.length + 22 // 23
	packet.info[4] = packet.info[4].toString("16").padStart(2, "0");
	packet.info[8] = coloraux1 + data.length;
	packet.info[8] = packet.info[8].toString("16").padStart(2, "0");
	packet.info[27] = data.length // 0d
	packet.info[27] = packet.info[27].toString("16").padStart(2, "0");
	packet.info[18] = coloraux2;
	packet.info[18] = packet.info[18].toString("16").padStart(2, "0");

	packet.content = data;
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
	checksum = checksum.toString(2).padStart(16, "0");
	let checksum1 = parseInt(checksum.slice(8, 16), 2);
	let checksum2 =  parseInt(checksum.slice(0, 8), 2);
	packet.checksum = [checksum1, checksum2, 174];

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
	const client = new net.Socket();
	try {
		client.connect(5200, ip, function () {
			client.write(u);
			client.destroy();
		});
	} catch (error) {
		setInterval(() => {
			client.connect(5200, ip, function () {
				client.write(u);
				client.destroy();
			});
		}, 3000);
	}
	
	client.on('data', function (data) {
	});
	client.on('close', function () {
		console.log('Connection closed');
	});
}




exports.screenPrinter = screenPrinter;

// screenPrinter("Hola mundo", "red", 1);
// screenPrinter("Hola mundo", "green", 2);
// screenPrinter("Hola mundo", "yellow", 3);























// let screen = 3;
// let coloraux1;
// let coloraux2;
// let color = "yellow";
// if (color == "red"){
// 	coloraux1 = 136;
// 	coloraux2 = 18;
// }else if(color == "green"){
// 	coloraux1 = 152;
// 	coloraux2 = 34;
// }else if(color == "yellow"){
// 	coloraux1 = 168;
// 	coloraux2 = 50;
// }
// let panel;
// let ip;
// if (screen == 1) {
// 	panel = ["35", "64", "35", "33", "30"] //10.10.10.180
// 	ip = "10.10.10.180";
// } if (screen == 2) {
// 	panel = ["35", "64", "35", "32", "65"] //10.10.10.181
// 	ip = "10.10.10.181";
// } if (screen == 3) {
// 	panel = ["38", "33", "61", "37", "62"] //10.10.10.182
// 	ip = "10.10.10.182";
// }



// input.setEncoding('UTF-8');
// input.on('data', function(line){
// 	let packet = null;
// 	line = line.split("")
// 	line.pop();
// 	line = line.join("");
// 	packet = {
// 		id_code: ["a5", "30", "30", "36", "30",
// 		"36", "65", "64"
// 		],
// 		network_data: panel,
// 		reservation: ["00"],
// 		type: ["68"],
// 		card_type: ["32"],
// 		card_id: ["ff"],
// 		cmd: ["74"],
// 		aditional_information: ["11"],
// 		info: ["00", "00", "00", "00", "cc1", "00",
// 				"77", "00", "cc2", "03", "00", "00", "00", "00",
// 				"00", "60", "00", "10", "cc3", "00",
// 				"00", "00", "00", "00", "00", "03", "00", "data_length"],
// 		content: [],
// 		checksum: ["", ""]
// 	}
// 	let buf = Buffer.from(line);
// 	let data = new Uint8Array(buf);
// 	console.log(data.length);
// 	packet.info[4] = data.length + 22 // 23
// 	packet.info[4] = packet.info[4].toString("16").padStart(2, "0");
// 	packet.info[8] = coloraux1 + data.length;
// 	packet.info[8] = packet.info[8].toString("16").padStart(2, "0");
// 	packet.info[27] = data.length // 0d
// 	packet.info[27] = packet.info[27].toString("16").padStart(2, "0");
// 	packet.info[18] = coloraux2;
// 	packet.info[18] = packet.info[18].toString("16").padStart(2, "0");

// 	packet.content = data;
// 	console.log(packet);
// 	let checksum = 0;
// 	for (let key in packet) {
// 		if (key !== "content" && key !== "checksum") {
// 			let str = packet[key].join("");
// 			packet[key] = new Uint8Array(Buffer.from(str, "hex"));
// 			if (key !== "id_code" && key !== "network_data" && key !== "reservation") {
// 				checksum += packet[key].reduce((total, num) => {return total + num});
// 			}
// 		} else {
// 			if (key === "content") {
// 				checksum += packet[key].reduce((total, num) => {return total + num});
// 			}
// 		}

// 	}
// 	checksum = checksum.toString(2).padStart(16, "0");
// 	let checksum1 = parseInt(checksum.slice(8, 16), 2);
// 	let checksum2 =  parseInt(checksum.slice(0, 8), 2);
// 	packet.checksum = [checksum1, checksum2, 174];

// 	let trama = [];
// 	for (let key in packet) {
// 		if (key !== "checksum") {
// 			trama = trama.concat(Array.from(packet[key]));
// 		} else {
// 			trama = trama.concat(packet[key]);
// 		}
// 	}
// 	const res = Buffer.from(trama);
// 	const u = new Uint8Array(res);
// 	console.log("----------------*****");
// 	console.log(Buffer.from(trama, 'hex').toString('hex'));
// 	console.log("kkkkkkkkkkkkkkkkkk*****");
// 	console.log(u);
// 	console.log("----------------****");

//     //quit on ctrl+c
//     if(line === '\u0003') process.exit(0);
//     client.write(u);
// });
// // show,Disponibles: 25.,green,
// // let trama = [
// // 	"a5", "30", "30", "36", "30", "36", "65", "64",
// // 	"35", "64", "35", "33", "30", "00", "68", "32",
// // 	"ff", "74", "11", "00", "00", "00", "00", "25",
// // 	"00", "77", "00", "a7", "03", "00", "00", "00",
// // 	"00", "00", "60", "00", "10", "22", "00", "00",
// // 	"00", "00", "00", "00", "03", "00", "0f", "44",
// // 	"69", "73", "70", "6f", "6e", "69", "62", "6c",
// // 	"65", "3a", "20", "32", "35", "2e", "00", "09",
// // 	"ae"
// // ];



// const client = new net.Socket();
// client.connect(5200, ip, function () {
// 	// const buf = Buffer.from(trama.join(""), "hex");
// 	// const uint8array = new Uint8Array(buf);
// 	// console.log("----------------");
// 	// console.log(uint8array);
// 	// console.log("----------------");
// 	// client.write(uint8array);
// });

// client.on('data', function (data) {
// 	console.log(data.toString());
// });

// client.on('close', function () {
// 	console.log('Connection closed');
// });