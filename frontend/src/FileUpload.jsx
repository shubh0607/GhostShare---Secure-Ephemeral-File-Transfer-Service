import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [downloadData, setDownloadData] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setDownloadData(null);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first.');
            return;
        }

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setDownloadData(response.data);
        } catch (err) {
            console.error(err);
            setError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload File</h2>
            <div className="file-input-wrapper">
                <input type="file" onChange={handleFileChange} />
            </div>
            <button onClick={handleUpload} disabled={uploading || !file}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>

            {error && <p className="error">{error}</p>}

            {downloadData && (
                <div className="result">
                    <h3>File Uploaded!</h3>
                    <p>Share this link (one-time use):</p>
                    <div className="link-box">
                        <input
                            type="text"
                            readOnly
                            value={downloadData.downloadUrl}
                            onClick={(e) => e.target.select()}
                        />
                        <button onClick={() => navigator.clipboard.writeText(downloadData.downloadUrl)}>
                            Copy
                        </button>
                    </div>
                    <p className="small">File ID: {downloadData.fileId}</p>
                    <p className="small">Key: {downloadData.key}</p>
                    <p className="small">IV: {downloadData.iv}</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
