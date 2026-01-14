import React, { useState } from 'react';
import axios from 'axios';

const FileDownload = () => {
    const [fileId, setFileId] = useState('');
    const [key, setKey] = useState('');
    const [iv, setIv] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState('');

    const handleDownload = async () => {
        if (!fileId || !key || !iv) {
            setError('Please provide File ID, Key, and IV.');
            return;
        }

        setDownloading(true);
        setError('');

        try {
            const response = await axios.get(`http://localhost:5000/files/${fileId}`, {
                params: { key, iv },
                responseType: 'blob', // Important for file download
            });

            // Create a link to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `file-${fileId}.bin`); // Or try to get name from header
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error(err);
            setError('Download failed. The file might have been deleted or the key is incorrect.');
        } finally {
            setDownloading(false);
        }
    };

    // Helper to parse URL if user pastes it
    const handleUrlPaste = (e) => {
        const urlString = e.target.value;
        try {
            const url = new URL(urlString);
            if (url.pathname.startsWith('/files/')) {
                const id = url.pathname.split('/files/')[1];
                const k = url.searchParams.get('key');
                const i = url.searchParams.get('iv');
                if (id) setFileId(id);
                if (k) setKey(k);
                if (i) setIv(i);
            }
        } catch (err) {
            // Not a valid URL, ignore
        }
    };

    return (
        <div className="download-container">
            <h2>Download File</h2>
            <p>Paste the full download URL or enter details manually.</p>

            <div className="input-group">
                <label>Full URL (optional helper)</label>
                <input type="text" placeholder="Paste link here to auto-fill" onChange={handleUrlPaste} />
            </div>

            <div className="input-group">
                <label>File ID</label>
                <input type="text" value={fileId} onChange={(e) => setFileId(e.target.value)} />
            </div>
            <div className="input-group">
                <label>Decryption Key</label>
                <input type="text" value={key} onChange={(e) => setKey(e.target.value)} />
            </div>
            <div className="input-group">
                <label>IV</label>
                <input type="text" value={iv} onChange={(e) => setIv(e.target.value)} />
            </div>

            <button onClick={handleDownload} disabled={downloading}>
                {downloading ? 'Downloading...' : 'Download'}
            </button>

            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default FileDownload;
