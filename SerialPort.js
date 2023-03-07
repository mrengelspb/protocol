var { SerialPort } = require('serialport');
const input = process.stdin;
//Using the UART3 from the Apalis i.MX6 module
var port = new SerialPort({
    path: '/dev/ttyUSB2',
	baudRate: 9600,
});

// input.setRawMode(true);
// input.resume();
input.setEncoding('UTF-8');

input.on('data', function(key){
    //quit on ctrl+c
    if(key === '\u0003') process.exit(0);
    port.write(key);
});

// port.on('open', function() {
// 	port.write('Connected', function writeHello(err) {
// 		if (err) {
// 			console.log('Error on write: ', err.message);
// 		}
// 		console.log('Connected...');
// 	});
// });

//If fail to connect in the first try, do it again periodically
// var tryHelloHandler = setInterval(function tryHelloUntilAnswered(){
// 	port.write('0', function writeHello(err) {
// 		if (err) {
// 			console.log('Error on write: ', err.message);
// 		}
// 		console.log('Retry to connect...');
// 	});
// }, 15000);

port.on('data', function(data){

    console.log(data.toString('hex'));
});

// open errors will be emitted as an error event
port.on('error', function(err) {
   console.log('Error: ', err.message);
});
