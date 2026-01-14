# GhostShare - Secure Ephemeral File Transfer Service

GhostShare is a secure, ephemeral file-sharing application designed to allow users to upload files and share them via a link. Files are automatically deleted after a specified duration, ensuring privacy and managing storage effectively.

## Features

- **Secure File Upload**: Upload files securely to the server.
- **Ephemeral Storage**: Files are automatically deleted after a set period (e.g., 24 hours) using a background cron job.
- **Download Links**: Generate unique links for sharing files.
- **Modern Frontend**: Built with React and Vite for a fast and responsive user experience.
- **RESTful API**: Robust backend API handling file operations.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **File Handling**: Multer
- **Scheduling**: Node-cron (for auto-cleanup)
- **Utilities**: Dotenv, Cors

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shubh0607/GhostShare---Secure-Ephemeral-File-Transfer-Service.git
   cd GhostShare---Secure-Ephemeral-File-Transfer-Service
   ```

2. **Backend Setup**
   Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the `backend` directory (optional, depending on default config) to set custom ports or configurations:
   ```env
   PORT=5000
   ```

   Start the backend server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`.

3. **Frontend Setup**
   Open a new terminal, navigate to the frontend directory and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

   Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

## Usage

1. Open the frontend application in your browser.
2. Select a file to upload.
3. Once uploaded, copy the generated download link.
4. Share the link with the intended recipient.
5. The file will be automatically deleted from the server after the configured expiration time.

## Project Structure

```
ghostshare/
├── backend/          # Node.js/Express backend
│   ├── uploads/      # Directory for stored files
│   ├── server.js     # Entry point
│   └── ...
├── frontend/         # React frontend
│   ├── src/          # Source code
│   └── ...
└── README.md         # Project documentation
```

## License

This project is open source and available under the [MIT License](LICENSE).
