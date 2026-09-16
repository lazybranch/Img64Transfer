// DOM Elements
const selectFileBtn = document.getElementById('select-file-btn');
const filePathDisplay = document.getElementById('file-path-display');
const fileStatus = document.getElementById('file-status');
const modeRadios = document.querySelectorAll('input[name="transferMode"]');
const sendSection = document.getElementById('send-section');
const receiveSection = document.getElementById('receive-section');

// Toggle between Send and Receive modes
modeRadios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'send') {
            sendSection.classList.remove('hidden');
            receiveSection.classList.add('hidden');
        } else {
            sendSection.classList.add('hidden');
            receiveSection.classList.remove('hidden');
        }
    });
});

// Trigger requestFileFromUser when clicking the selection button
selectFileBtn.addEventListener('click', async () => {
    try {
        let selectedPath = null;

        // Check if electronAPI bridge is exposed from preload
        if (window.electronAPI && typeof window.electronAPI.requestFileFromUser === 'function') {
            selectedPath = await window.electronAPI.requestFileFromUser();
        } else {
            console.log('[renderer] requestFileFromUser triggered. Electron IPC bridge will handle this once BrowserWindow and preload are linked.');
        }

        if (selectedPath) {
            filePathDisplay.textContent = selectedPath;
            fileStatus.classList.remove('hidden');
        }
    } catch (error) {
        console.error('[renderer] Error executing requestFileFromUser:', error);
    }
});
