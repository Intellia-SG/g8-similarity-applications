// scripts/clean_audio.js
// Audio cleanup script removing orphaned files not present in active audioMap (TRD §11)

import fs from 'fs';
import path from 'path';

const mapFile = path.resolve('src/utils/audioMap.js');
const audioDir = path.resolve('public/assets/audio');

if (fs.existsSync(mapFile) && fs.existsSync(audioDir)) {
  const content = fs.readFileSync(mapFile, 'utf-8');
  const files = fs.readdirSync(audioDir);

  let cleaned = 0;
  for (const f of files) {
    if (!content.includes(f) && f.endsWith('.mp3')) {
      fs.unlinkSync(path.join(audioDir, f));
      cleaned++;
    }
  }

  console.log(`🧹 Cleaned up ${cleaned} orphaned audio files.`);
} else {
  console.log('ℹ️ No audio files to clean.');
}
