const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const algorithm = 'aes-256-cbc';

// Encrypts a file stream and saves it to the destination
// Returns a promise that resolves with the key and iv
const encryptFile = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        // Generate a random key and iv
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const input = fs.createReadStream(inputPath);
        const output = fs.createWriteStream(outputPath);

        input.pipe(cipher).pipe(output);

        output.on('finish', () => {
            resolve({
                key: key.toString('hex'),
                iv: iv.toString('hex')
            });
        });

        output.on('error', (err) => {
            reject(err);
        });
    });
};

// Decrypts a file stream and pipes it to the response
const decryptFileStream = (filePath, keyHex, ivHex, res) => {
    const key = Buffer.from(keyHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const input = fs.createReadStream(filePath);

    input.pipe(decipher).pipe(res);
    
    return new Promise((resolve, reject) => {
        res.on('finish', resolve);
        res.on('error', reject);
        input.on('error', reject);
        decipher.on('error', reject);
    });
};

module.exports = { encryptFile, decryptFileStream };
