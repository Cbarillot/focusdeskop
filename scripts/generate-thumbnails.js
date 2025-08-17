const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Dossiers source et destination
const videosDir = path.join(__dirname, '../public/assets/themes/videos');
const thumbnailsDir = path.join(__dirname, '../public/assets/themes/thumbnails');

// Vérifier si FFmpeg est installé
try {
  execSync('ffmpeg -version');
} catch (error) {
  console.error('Erreur : FFmpeg n\'est pas installé ou n\'est pas dans le PATH');
  process.exit(1);
}

// Créer le dossier des miniatures s'il n'existe pas
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Fonction pour générer une miniature
generateThumbnail = (videoPath, outputPath) => {
  try {
    const cmd = `ffmpeg -i "${videoPath}" -ss 00:00:01.000 -vframes 1 -vf "scale=320:-1" -y "${outputPath}"`;
    execSync(cmd, { stdio: 'ignore' });
    console.log(`Miniature générée : ${outputPath}`);
  } catch (error) {
    console.error(`Erreur lors de la génération de la miniature pour ${videoPath}:`, error.message);
  }
};

// Parcourir les fichiers vidéo
fs.readdir(videosDir, (err, files) => {
  if (err) {
    console.error('Erreur lors de la lecture du dossier des vidéos :', err);
    return;
  }

  files.forEach(file => {
    if (file.endsWith('.mp4') || file.endsWith('.webm')) {
      const videoPath = path.join(videosDir, file);
      const thumbnailName = path.basename(file, path.extname(file)) + '.jpg';
      const thumbnailPath = path.join(thumbnailsDir, thumbnailName);
      
      // Vérifier si la miniature existe déjà
      if (!fs.existsSync(thumbnailPath)) {
        generateThumbnail(videoPath, thumbnailPath);
      } else {
        console.log(`La miniature existe déjà : ${thumbnailPath}`);
      }
    }
  });
});
