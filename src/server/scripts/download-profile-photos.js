const fs = require('fs');
const path = require('path');
const https = require('https');

const PHOTO_URLS = {
  'ayse.jpg': 'https://randomuser.me/api/portraits/women/1.jpg',
  'mehmet.jpg': 'https://randomuser.me/api/portraits/men/1.jpg',
  'zeynep.jpg': 'https://randomuser.me/api/portraits/women/2.jpg',
  'can.jpg': 'https://randomuser.me/api/portraits/men/2.jpg',
  'elif.jpg': 'https://randomuser.me/api/portraits/women/3.jpg',
  'ahmet.jpg': 'https://randomuser.me/api/portraits/men/3.jpg',
  'selin.jpg': 'https://randomuser.me/api/portraits/women/4.jpg',
  'burak.jpg': 'https://randomuser.me/api/portraits/men/4.jpg',
  'deniz.jpg': 'https://randomuser.me/api/portraits/women/5.jpg',
  'mert.jpg': 'https://randomuser.me/api/portraits/men/5.jpg'
};

const IMAGES_DIR = path.join(__dirname, '../../../public/images/users');

// Dizini oluştur
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Fotoğrafları indir
Object.entries(PHOTO_URLS).forEach(([filename, url]) => {
  const filePath = path.join(IMAGES_DIR, filename);
  
  https.get(url, (response) => {
    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);

    fileStream.on('finish', () => {
      console.log(`Downloaded: ${filename}`);
      fileStream.close();
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${filename}:`, err.message);
  });
}); 