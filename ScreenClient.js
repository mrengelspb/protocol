function screenPrinter(line, color, screen) {
	const net = require('net');
	const PORT = 5200;
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
		panel = ["35", "64", "35", "33", "30"]
		ip = "192.168.80.180";
	} if (screen == 2) {
		panel = ["35", "64", "35", "32", "65"]
		ip = "192.168.80.51";
	} if (screen == 3) {
		panel = ["38", "33", "61", "37", "62"]
		ip = "192.168.80.52";
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
	const buffer = Buffer.from(trama);
	const bytes = new Uint8Array(buffer);
	const client = new net.Socket();
	client.connect(PORT, ip, function () {
		client.write(bytes);
		client.destroy();
	});
	client.on('error', () => {
		console.log(`Panel ${ip} fuera de red`);
	});
}

exports.screenPrinter = screenPrinter;
