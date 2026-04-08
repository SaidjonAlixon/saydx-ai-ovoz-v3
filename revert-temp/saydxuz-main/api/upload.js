import 'dotenv/config';

export default async function handler(req, res) {
  console.log('Upload API chaqirildi:', req.method, req.url);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      console.log('Fayl yuklash so\'rovi kelgan');
      console.log('Content-Type:', req.headers['content-type']);
      
      // Vercel'da fayl yuklash uchun multer yoki boshqa middleware kerak
      // Hozircha oddiy yechim - faylni base64 formatida qabul qilamiz
      
      if (!req.body.file) {
        return res.status(400).json({
          success: false,
          message: "Fayl yuborilmagan"
        });
      }

      // Fayl ma'lumotlarini olamiz
      const { file, fileName, fileType, originalName } = req.body;
      
      if (!file || !fileName) {
        return res.status(400).json({
          success: false,
          message: "Fayl ma'lumotlari to'liq emas"
        });
      }

      // Fayl hajmini tekshiramiz (15MB limit)
      const fileSizeInBytes = (file.length * 3) / 4; // base64 to bytes
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
      
      if (fileSizeInMB > 15) {
        return res.status(400).json({
          success: false,
          message: "Fayl hajmi 15MB dan katta"
        });
      }

      // Vercel'da faylni saqlash uchun oddiy yechim
      // Hozircha faylni base64 formatida qaytaramiz
      const fileUrl = `data:${fileType || 'application/octet-stream'};base64,${file}`;
      
      console.log('Fayl muvaffaqiyatli yuklandi:', fileName);
      console.log('Upload result:', {
        fileName: originalName || fileName,
        fileSize: fileSizeInMB.toFixed(2) + ' MB',
        fileUrl: fileUrl.substring(0, 50) + '...'
      });
      
      res.status(200).json({
        success: true,
        fileUrl: fileUrl,
        fileName: originalName || fileName,
        fileSize: fileSizeInMB.toFixed(2) + ' MB'
      });

    } catch (error) {
      console.error('Fayl yuklashda xatolik:', error);
      res.status(500).json({
        success: false,
        message: "Fayl yuklashda xatolik",
        error: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
