const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  return win;
};

app.whenReady().then(() => {
  let win = createWindow();
  win.loadFile('./index.html');
  const child = spawn('node', ['octupus.js']);
  let con = [];
  child.stdout.on('data', (data) => {
    if (con.length == 10) {
      con.shift();
    }
    con.push('<p>' + data + '</p>');
    win.loadURL("data:text/html;charset=utf-8," + encodeURI('<body><h1>Octupus V.2.0.1</h1>' + con.join("") + '</body>'));
  });

  child.stdout.on('err', (err) => {
    console.log(err);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});