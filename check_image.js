import fs from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'uploads', '47.jpg');
console.log('Checking file:', filePath);
if (fs.existsSync(filePath)) {
  console.log('File exists!');
  const stats = fs.statSync(filePath);
  console.log('Size:', stats.size);
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    console.log('File is readable!');
  } catch (err) {
    console.error('File is NOT readable:', err);
  }
} else {
  console.error('File does NOT exist!');
}
