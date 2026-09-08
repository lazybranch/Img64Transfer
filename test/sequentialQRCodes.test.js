const fs = require('fs').promises;
const QRCode = require('qrcode');

jest.mock('fs', () => ({
    promises: {
        access: jest.fn(),
        mkdir: jest.fn(),
    },
}));

jest.mock('qrcode', () => ({
    toFile: jest.fn().mockResolvedValue(undefined),
}));

const { generateAnimatedQRCodes } = require('../utils/sequentialQRCodes');

describe('generateAnimatedQRCodes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('directory creation', () => {
        test('creates output directory when it does not exist', async () => {
            const image = {
                result: 'A'.repeat(100),
                countChars: 100,
            };

            fs.access.mockRejectedValue(new Error('Directory not found'));

            await generateAnimatedQRCodes(image);

            expect(fs.mkdir).toHaveBeenCalledWith('./animated_qrs');
        });

        test('does not create output directory when it already exists', async () => {
            const image = {
                result: 'A'.repeat(100),
                countChars: 100,
            };

            fs.access.mockResolvedValue();

            await generateAnimatedQRCodes(image);

            expect(fs.mkdir).not.toHaveBeenCalled();
        });
    });

    describe('qr generation', () => {
        test('generates a single QR when data fits in one chunk', async () => {
            const image = {
                result: 'A'.repeat(500),
                countChars: 500,
            };

            fs.access.mockResolvedValue();

            await generateAnimatedQRCodes(image);

            expect(QRCode.toFile).toHaveBeenCalledTimes(1);
        });

        test('generates the correct number of QR codes', async () => {
            const image = {
                result: 'A'.repeat(2500),
                countChars: 2500,
            };

            fs.access.mockResolvedValue();

            await generateAnimatedQRCodes(image);

            expect(QRCode.toFile).toHaveBeenCalledTimes(3);
        });

        test('uses correctly padded filenames', async () => {
            const image = {
                result: 'A'.repeat(2500),
                countChars: 2500,
            };

            fs.access.mockResolvedValue();

            await generateAnimatedQRCodes(image);

            expect(QRCode.toFile).toHaveBeenNthCalledWith(
                1,
                './animated_qrs/qr_part_0000.png',
                expect.any(String),
                expect.any(Object)
            );

            expect(QRCode.toFile).toHaveBeenNthCalledWith(
                2,
                './animated_qrs/qr_part_0001.png',
                expect.any(String),
                expect.any(Object)
            );

            expect(QRCode.toFile).toHaveBeenNthCalledWith(
                3,
                './animated_qrs/qr_part_0002.png',
                expect.any(String),
                expect.any(Object)
            );
        });
    });

    describe('payload generation', () => {
        test('builds the payload correctly for a single chunk', async () => {
            const image = {
                result: 'ABCDEFGHIJ',
                countChars: 10,
            };

            fs.access.mockResolvedValue();

            await generateAnimatedQRCodes(image);

            expect(QRCode.toFile).toHaveBeenCalledWith(
                './animated_qrs/qr_part_0000.png',
                '0|1|ABCDEFGHIJ',
                expect.objectContaining({
                    errorCorrectionLevel: 'L',
                    margin: 2,
                    width: 400,
                })
            );
        });

        test('splits data into multiple chunks correctly', async () => {
            const image = {
                result: 'A'.repeat(1000) +
                        'B'.repeat(1000) +
                        'C'.repeat(500),
                countChars: 2500,
            };

            fs.access.mockResolvedValue();

            await generateAnimatedQRCodes(image);

            expect(QRCode.toFile).toHaveBeenNthCalledWith(
                1,
                expect.any(String),
                `0|3|${'A'.repeat(1000)}`,
                expect.any(Object)
            );

            expect(QRCode.toFile).toHaveBeenNthCalledWith(
                2,
                expect.any(String),
                `1|3|${'B'.repeat(1000)}`,
                expect.any(Object)
            );

            expect(QRCode.toFile).toHaveBeenNthCalledWith(
                3,
                expect.any(String),
                `2|3|${'C'.repeat(500)}`,
                expect.any(Object)
            );
        });
    });

    describe('qr options', () => {
        test('uses the expected QR code configuration', async () => {
            const image = {
                result: 'HELLO',
                countChars: 5,
            };

            fs.access.mockResolvedValue();

            await generateAnimatedQRCodes(image);

            expect(QRCode.toFile).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(String),
                {
                    errorCorrectionLevel: 'L',
                    margin: 2,
                    width: 400,
                }
            );
        });
    });
});