const fs = require('fs');
const path = require('path');
const https = require('https');

const BACKGROUND_URL = 'https://source.unsplash.com/1600x900/?dating,couple,love';
const IMAGES_DIR = path.join(__dirname, '../../../public/images');
const FILE_PATH = path.join(IMAGES_DIR, 'hero-bg.jpg');

// Dizini oluştur
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Arka plan görselini indir
https.get(BACKGROUND_URL, (response) => {
  const fileStream = fs.createWriteStream(FILE_PATH);
  response.pipe(fileStream);

  fileStream.on('finish', () => {
    console.log('Background image downloaded successfully');
    fileStream.close();
  });
}).on('error', (err) => {
  console.error('Error downloading background image:', err.message);
}); 