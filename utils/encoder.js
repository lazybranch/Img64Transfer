const fs = require("fs").promises;

const encode = async (imgPath) => {
    try {
        const data = await fs.readFile(imgPath);

        const imgBase64 = data.toString("base64");

        const obj = {
            sourceImg: data,
            sourceImgPath: imgPath,
            result: imgBase64,
            countChars: imgBase64.length,
        };

        return obj;
    } catch (error) {
        console.error(`There was an error: ${error.message}`);
    }
}

module.exports = {
    encode,
}