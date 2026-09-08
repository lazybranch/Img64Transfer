const { app, dialog } = require('electron');
const { encode } = require('./utils/encoder');
const { generateAnimatedQRCodes } = require('./utils/sequentialQRCodes');

app.whenReady().then(async () => {
    const selection = await dialog.showOpenDialog({
        title: 'Select an image',
        properties: ['openFile'],
        filters: [
            {
                name: 'Base64 compatible',
                extensions: ['png', 'jpg', 'jpeg', 'webp']
            }
        ]
    });

    if (!selection.canceled && selection.filePaths.length > 0) {
        console.log("Img path:", selection.filePaths[0]);
    } else {
        console.log("Selection cancelled");
    }
    
    app.quit();
});