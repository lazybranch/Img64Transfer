const fs = require('fs').promises;
const QRCode = require('qrcode');

const CHUNK_SIZE = 1000;
const OUTPUT_DIR = './animated_qrs';

/**
 * @typedef {Object} Base64Img
 * @property {Image} sourceImg - The original image object.
 * @property {string} sourceImgPath - The file path of the original image.
 * @property {string} result - The image encoded as a Base64 string.
 * @property {number} countChars - The total character length of the Base64 string.
 */

async function generateAnimatedQRCodes(b64Img) {
    try {
        await fs.access(OUTPUT_DIR);
    } catch {
        await fs.mkdir(OUTPUT_DIR);
    }

    const totalChunks = Math.ceil(b64Img.countChars / CHUNK_SIZE);
    console.log(`Base64 size: ${b64Img.countChars} characters`);
    console.log(`Generating ${totalChunks} QR codes...`);

    for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = start + CHUNK_SIZE;

        const chunkData = b64Img.result.slice(start, end);

        // payload struct: PART_ID|TOTAL_PARTS|BASE64_DATA
        const payload = `${i}|${totalChunks}|${chunkData}`;

        const fileName = `${OUTPUT_DIR}/qr_part_${String(i).padStart(4, '0')}.png`;

        await QRCode.toFile(fileName, payload, {
            errorCorrectionLevel: 'L', // low
            margin: 2,
            width: 400,
        });
    }

    console.log(`Done! All QR codes saved in the folder: '${OUTPUT_DIR}'.`);
    console.log(`To stream them, display these images on a loop at about 5-10 frames per second.`);
}

module.exports = {
    generateAnimatedQRCodes,
}