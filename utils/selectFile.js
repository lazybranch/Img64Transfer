const { dialog } = require('electron');

const requestFileFromUser = async () => {
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
        return selection.filePaths[0];
    } else {
        // a user cancelling a dialog is an expected and valid action, not an error; that is why we do not use exceptions.
        console.log("Selection cancelled");
        return null;
    }
}

module.exports = {
    requestFileFromUser,
}