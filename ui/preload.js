const { contextBridge, ipcRenderer } = require('electron');

// Expose secure API bridge to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    requestFileFromUser: () => ipcRenderer.invoke('dialog:select-file'),
});
