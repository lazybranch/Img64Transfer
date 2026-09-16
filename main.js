const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { encode } = require('./utils/encoder');
const { generateAnimatedQRCodes } = require('./utils/sequentialQRCodes');
const { requestFileFromUser } = require('./utils/selectFile');

function createWindow() {
    const iconFile = process.platform === 'win32' ? 'icon96x96.ico' : 'icon96x96.png';
    const mainWindow = new BrowserWindow({
        width: 750,
        height: 600,
        minWidth: 520,
        minHeight: 480,
        backgroundColor: '#675181',
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets', 'icons', iconFile),
        webPreferences: {
            preload: path.join(__dirname, 'ui', 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'ui', 'index.html'));
}

app.whenReady().then(() => {
    ipcMain.handle('dialog:select-file', async () => {
        const filePath = await requestFileFromUser();
        return filePath;
    });

    createWindow();

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