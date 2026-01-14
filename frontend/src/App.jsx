import React, { useState } from 'react';
import FileUpload from './FileUpload';
import FileDownload from './FileDownload';
import './App.css';

function App() {
  const [mode, setMode] = useState('upload'); // 'upload' or 'download'

  return (
    <div className="app">
      <header>
        <h1>GhostShare</h1>
        <p>Secure, Ephemeral File Sharing</p>
      </header>

      <nav>
        <button
          className={mode === 'upload' ? 'active' : ''}
          onClick={() => setMode('upload')}
        >
          Send File
        </button>
        <button
          className={mode === 'download' ? 'active' : ''}
          onClick={() => setMode('download')}
        >
          Receive File
        </button>
      </nav>

      <main>
        {mode === 'upload' ? <FileUpload /> : <FileDownload />}
      </main>
    </div>
  );
}

export default App;
