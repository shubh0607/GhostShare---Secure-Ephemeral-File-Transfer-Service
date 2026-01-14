const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, 'uploads');

const startCleanupJob = () => {
    // Run every hour
    cron.schedule('0 * * * *', () => {
        console.log('Running cleanup job...');
        fs.readdir(UPLOADS_DIR, (err, files) => {
            if (err) {
                console.error('Error reading uploads directory:', err);
                return;
            }

            const now = Date.now();
            const ONE_DAY = 24 * 60 * 60 * 1000;

            files.forEach(file => {
                const filePath = path.join(UPLOADS_DIR, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        console.error(`Error checking stats for ${file}:`, err);
                        return;
                    }

                    if (now - stats.mtimeMs > ONE_DAY) {
                        fs.unlink(filePath, (err) => {
                            if (err) console.error(`Error deleting ${file}:`, err);
                            else console.log(`Deleted old file: ${file}`);
                        });
                    }
                });
            });
        });
    });
};

module.exports = startCleanupJob;
