class Protocol {
  constructor() {
  }
  openPort(config) {
    if (config.type === 'db') {
      this.database = new config.adapter('local');
    } else if (config.type === 'ws') {
      this.socket = new config.adapter(this.database);
      this.socket.init(); 
    } else if (config.type === 'tcp') {
      this.tcp = new config.adapter(this.database);
      this.tcp.init(config.port);
    } else if (config.type === 'http') {
      this.http = new config.adapter();
      this.http.init(config.port);
    } else {
      console.log('Error: No se ha encontrado el tipo de puerto a abrir.')
    }
  }
}

exports.Protocol = Protocol;
