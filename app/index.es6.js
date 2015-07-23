let app = require('app');
let BrowserWindow = require('browser-window');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });
    mainWindow.loadUrl('file://' + __dirname + '/../src/browser/index.html');

    // Open the devtools.
    mainWindow.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});