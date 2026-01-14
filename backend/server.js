const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { encryptFile, decryptFileStream } = require('./utils/cryptoUtils');
const startCleanupJob = require('./cronJob');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Multer setup - save temporarily to disk before encryption
const upload = multer({ dest: 'temp_uploads/' });

// Ensure temp directory exists
if (!fs.existsSync('temp_uploads')) {
    fs.mkdirSync('temp_uploads');
}

// Start the cleanup job
startCleanupJob();

// Upload Route
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const tempPath = req.file.path;
    const fileId = req.file.filename; // Use multer's generated filename as ID
    const encryptedPath = path.join(UPLOADS_DIR, fileId);

    try {
        const { key, iv } = await encryptFile(tempPath, encryptedPath);

        // Delete the unencrypted temp file
        fs.unlinkSync(tempPath);

        res.json({
            fileId,
            key,
            iv,
            downloadUrl: `http://localhost:${PORT}/files/${fileId}?key=${key}&iv=${iv}`
        });
    } catch (error) {
        console.error('Encryption error:', error);
        // Try to cleanup temp file if it exists
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        res.status(500).json({ error: 'Encryption failed' });
    }
});

// Download Route
app.get('/files/:id', async (req, res) => {
    const fileId = req.params.id;
    const { key, iv } = req.query;

    if (!key || !iv) {
        return res.status(400).json({ error: 'Missing encryption key or IV' });
    }

    const filePath = path.join(UPLOADS_DIR, fileId);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found or expired' });
    }

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="downloaded_file"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    try {
        await decryptFileStream(filePath, key, iv, res);

        // Delete file after successful download (as per requirements)
        // Note: We wait for the stream to finish in decryptFileStream, but that resolves when piping is done.
        // However, we need to be careful not to delete before it's fully sent.
        // The decryptFileStream promise resolves when 'finish' is emitted on res.

        fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting file ${fileId}:`, err);
            else console.log(`File ${fileId} deleted after download.`);
        });

    } catch (error) {
        console.error('Decryption/Download error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Download failed' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
