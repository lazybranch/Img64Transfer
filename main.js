const { app } = require('electron');
const { encode } = require('./utils/encoder');
const { generateAnimatedQRCodes } = require('./utils/sequentialQRCodes');
const { requestFileFromUser } = require('./utils/selectFile');

app.whenReady().then(async () => {
    const imagePath = await requestFileFromUser();

    if (!imagePath) {
        console.log("File not found. Closing app...");
        app.quit();
        return;
    }

    console.log("Processing: ", imagePath);
    
    app.quit();
});