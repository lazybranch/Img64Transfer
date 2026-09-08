const fs = require("fs").promises;

const { encode } = require("../utils/encoder");

describe("encode", () => {
    const imagePath = "media/img/dogs_1.jpg";

    test("encodes an image to Base64", async () => {
        const result = await encode(imagePath);

        expect(result).toBeDefined();
        expect(result.sourceImgPath).toBe(imagePath);
        expect(result.result).toBeDefined();
        expect(typeof result.result).toBe("string");
        expect(result.countChars).toBe(result.result.length);
    });

    test("returns the original image data", async () => {
        const result = await encode(imagePath);
        const originalData = await fs.readFile(imagePath);

        expect(result.sourceImg).toEqual(originalData);
    });

    test("returns a valid Base64 string", async () => {
        const result = await encode(imagePath);

        expect(result.result).toMatch(/^[A-Za-z0-9+/]*={0,2}$/);
    });

    test("returns the correct Base64 representation", async () => {
        const result = await encode(imagePath);
        const originalData = await fs.readFile(imagePath);

        const expectedBase64 = originalData.toString("base64");

        expect(result.result).toBe(expectedBase64);
    });

    test("returns undefined when the image does not exist", async () => {
        const result = await encode("media/img/nonexistent.jpg");

        expect(result).toBeUndefined();
    });
});