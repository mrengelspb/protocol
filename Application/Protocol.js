class Protocol {
  constructor() {
  }
  openPort(config) {
    if (config.type === 'db') {
      this.database = new config.adapter();
    } else if (config.type === 'ws') {
      this.socket = new config.adapter(this.database);
      this.socket.init();
    } else {
      console.log('Error: No se ha encontrado el tipo de puerto a abrir.')
    }
  }
}

exports.Protocol = Protocol;
