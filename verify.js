const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:5000';
const TEST_FILE_PATH = path.join(__dirname, 'test.txt');
const DOWNLOAD_PATH = path.join(__dirname, 'downloaded.txt');

// Create a dummy file
fs.writeFileSync(TEST_FILE_PATH, 'This is a secret message for GhostShare verification.');

const runVerification = async () => {
    try {
        console.log('1. Uploading file...');
        const formData = new FormData();
        formData.append('file', fs.createReadStream(TEST_FILE_PATH));

        const uploadRes = await axios.post(`${BASE_URL}/upload`, formData, {
            headers: formData.getHeaders()
        });

        const { fileId, key, iv } = uploadRes.data;
        console.log('   Upload successful!');
        console.log(`   ID: ${fileId}`);
        console.log(`   Key: ${key}`);
        console.log(`   IV: ${iv}`);

        console.log('2. Downloading file...');
        const downloadRes = await axios.get(`${BASE_URL}/files/${fileId}`, {
            params: { key, iv },
            responseType: 'arraybuffer'
        });

        fs.writeFileSync(DOWNLOAD_PATH, downloadRes.data);
        console.log('   Download successful!');

        const original = fs.readFileSync(TEST_FILE_PATH, 'utf8');
        const downloaded = fs.readFileSync(DOWNLOAD_PATH, 'utf8');

        if (original === downloaded) {
            console.log('3. Content verification PASSED: Files match.');
        } else {
            console.error('3. Content verification FAILED: Files do not match.');
        }

        console.log('4. Verifying deletion...');
        try {
            await axios.get(`${BASE_URL}/files/${fileId}`, {
                params: { key, iv }
            });
            console.error('   Deletion verification FAILED: File still exists.');
        } catch (err) {
            if (err.response && err.response.status === 404) {
                console.log('   Deletion verification PASSED: File not found (404) as expected.');
            } else {
                console.error('   Deletion verification error:', err.message);
            }
        }

    } catch (err) {
        console.error('Verification failed:', err.message);
        if (err.response) {
            console.error('Response data:', err.response.data);
        }
    } finally {
        // Cleanup local test files
        if (fs.existsSync(TEST_FILE_PATH)) fs.unlinkSync(TEST_FILE_PATH);
        if (fs.existsSync(DOWNLOAD_PATH)) fs.unlinkSync(DOWNLOAD_PATH);
    }
};

runVerification();
