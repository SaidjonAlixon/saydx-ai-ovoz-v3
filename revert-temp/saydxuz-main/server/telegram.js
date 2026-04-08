import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

// Vercel uchun - har safar yangi bot instance yaratamiz
export async function sendLeadToTelegram(leadData) {
  console.log('sendLeadToTelegram chaqirildi');
  
  // To'g'ridan-to'g'ri kodga kiritilgan qiymatlar (fallback)
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8035044995:AAEaf8t64VzYT8fyxFnowXe474wQBAhrA1k';
  const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1002663722196';
  
  console.log('Bot token:', BOT_TOKEN ? 'mavjud' : 'yo\'q');
  console.log('Kanal ID:', CHANNEL_ID ? 'mavjud' : 'yo\'q');
  console.log('Bot token qiymati:', BOT_TOKEN);
  console.log('Kanal ID qiymati:', CHANNEL_ID);
  
  if (!BOT_TOKEN || !CHANNEL_ID) {
    console.log('Telegram bot sozlanmagan yoki kanal ID topilmadi');
    console.log('BOT_TOKEN:', BOT_TOKEN);
    console.log('CHANNEL_ID:', CHANNEL_ID);
    return { success: false, message: 'Telegram bot sozlanmagan' };
  }
  
  // Har safar yangi bot instance yaratamiz (Vercel serverless uchun)
  const bot = new TelegramBot(BOT_TOKEN, { polling: false });
  console.log('Telegram bot ishga tushirildi');
  console.log('Bot instance yaratildi:', !!bot);

  try {
    // Ariza ma'lumotlarini formatlaymiz
    const message = `
🆕 **Yangi Ariza**

👤 **Mijoz:** ${leadData.name}
📞 **Telefon:** ${leadData.phone}
${leadData.telegram ? `📱 **Telegram:** @${leadData.telegram.replace('@', '')}` : ''}
🔧 **Xizmat:** ${leadData.serviceType}
${leadData.budget ? `💰 **Byudjet:** ${leadData.budget}` : ''}
${leadData.timeline ? `⏰ **Muddat:** ${leadData.timeline}` : ''}
${leadData.description ? `📝 **Tavsif:** ${leadData.description}` : ''}
${leadData.fileUrl ? `📎 **Qo'shimcha fayl:** ${leadData.fileUrl.split('/').pop()}` : ''}

🕐 **Vaqt:** ${new Date().toLocaleString('uz-UZ')}
🆔 **ID:** ${leadData.id}
    `.trim();

    // Avval ariza matnini yuboramiz
    console.log('Xabar yuborishga harakat qilinmoqda...');
    console.log('Xabar matni:', message);
    console.log('Kanal ID:', CHANNEL_ID);
    
    const arizaResult = await bot.sendMessage(CHANNEL_ID, message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    });

    console.log('Ariza matni yuborildi:', arizaResult.message_id);
    console.log('Xabar natijasi:', arizaResult);

    // Agar fayl mavjud bo'lsa, faylni alohida yuboramiz
    console.log('Fayl tekshiruvi:', {
      fileUrl: leadData.fileUrl,
      hasFileUrl: !!leadData.fileUrl,
      fileUrlType: typeof leadData.fileUrl,
      fileName: leadData.fileName,
      hasFileName: !!leadData.fileName
    });
    
    if (leadData.fileUrl) {
      console.log('Fayl yuborish jarayoni boshlanmoqda...');
      try {
        // Base64 fayl uchun
        if (leadData.fileUrl.startsWith('data:')) {
          const [header, base64Data] = leadData.fileUrl.split(',');
          const mimeType = header.match(/data:([^;]+)/)?.[1] || 'application/octet-stream';
          
          // Fayl nomidan extension olamiz (asosiy)
          const originalFileName = leadData.fileName || '';
          const fileExtension = originalFileName.split('.').pop()?.toLowerCase() || mimeType.split('/')[1] || 'bin';
          
          // Fayl turini aniqlaymiz (asosiy extension bo'yicha)
          let fileType = 'document';
          let fileIcon = '📄';
          
          // Avval extension bo'yicha tekshiramiz
          if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
            fileType = 'photo';
            fileIcon = '🖼️';
          } else if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(fileExtension)) {
            fileType = 'video';
            fileIcon = '🎥';
          } else if (['mp3', 'wav', 'ogg', 'm4a'].includes(fileExtension)) {
            fileType = 'audio';
            fileIcon = '🎵';
          } else if (fileExtension === 'pdf') {
            fileType = 'document';
            fileIcon = '📕';
          } else if (['doc', 'docx'].includes(fileExtension)) {
            fileType = 'document';
            fileIcon = '📘';
          } else if (['xls', 'xlsx'].includes(fileExtension)) {
            fileType = 'document';
            fileIcon = '📊';
          } else if (['ppt', 'pptx'].includes(fileExtension)) {
            fileType = 'document';
            fileIcon = '📋';
          } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(fileExtension)) {
            fileType = 'document';
            fileIcon = '🗜️';
          } else if (['txt', 'md'].includes(fileExtension)) {
            fileType = 'document';
            fileIcon = '📄';
          }

          // Fayl nomini to'g'ri olamiz - asl fayl nomini ishlatamiz
          const fileName = originalFileName || `fayl.${fileExtension}`;
          const fileCaption = `${fileIcon} **Qo'shimcha fayl:** ${fileName}`;
          
          console.log('Fayl nomi tekshiruvi:', {
            originalFileName,
            fileName,
            fileExtension,
            finalFileName: fileName
          });
          
          console.log('Fayl ma\'lumotlari:', {
            fileName,
            fileExtension,
            mimeType,
            fileType,
            fileIcon,
            originalFileName: leadData.fileName
          });

          // Base64 faylni Buffer'ga o'tkazamiz
          const fileBuffer = Buffer.from(base64Data, 'base64');
          
          // Telegram Bot API uchun to'g'ri format
          const fileStream = fileBuffer;

          // Faylni alohida yuboramiz
          let fileResult;
          console.log('Fayl yuborish jarayoni:', {
            fileType,
            fileName,
            fileSize: fileBuffer.length,
            mimeType
          });
          
          if (fileType === 'photo') {
            fileResult = await bot.sendPhoto(CHANNEL_ID, fileStream, {
              caption: fileCaption,
              parse_mode: 'Markdown'
            });
          } else if (fileType === 'video') {
            fileResult = await bot.sendVideo(CHANNEL_ID, fileStream, {
              caption: fileCaption,
              parse_mode: 'Markdown'
            });
          } else if (fileType === 'audio') {
            fileResult = await bot.sendAudio(CHANNEL_ID, fileStream, {
              caption: fileCaption,
              parse_mode: 'Markdown'
            });
          } else {
            // Barcha boshqa fayllar uchun document sifatida yuboramiz
            // Telegram'da fayl nomini to'g'ri belgilash uchun
            const documentOptions = {
              caption: fileCaption,
              parse_mode: 'Markdown'
            };
            
            // Fayl nomini to'g'ri belgilash
            if (fileName && !fileName.includes('fayl.')) {
              documentOptions.filename = fileName;
            }
            
            console.log('Document yuborish parametrlari:', documentOptions);
            
            fileResult = await bot.sendDocument(CHANNEL_ID, fileStream, documentOptions);
          }

          console.log('Fayl yuborildi:', fileResult.message_id);
          console.log('Fayl yuborish natijasi:', fileResult);
        } else {
          // Oddiy fayl URL uchun (eski usul)
          const filePath = leadData.fileUrl.startsWith('/') ? leadData.fileUrl.substring(1) : leadData.fileUrl;
          const fullFilePath = leadData.fileUrl.startsWith('/tmp/') ? leadData.fileUrl : `./${filePath}`;
          
          const fileExtension = filePath.split('.').pop().toLowerCase();
          let fileType = 'document';
          let fileIcon = '📄';
          
          if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            fileType = 'photo';
            fileIcon = '🖼️';
          } else if (['mp4', 'avi', 'mov'].includes(fileExtension)) {
            fileType = 'video';
            fileIcon = '🎥';
          } else if (['mp3', 'wav', 'ogg'].includes(fileExtension)) {
            fileType = 'audio';
            fileIcon = '🎵';
          } else if (['pdf'].includes(fileExtension)) {
            fileType = 'document';
            fileIcon = '📕';
          } else if (['doc', 'docx'].includes(fileExtension)) {
            fileType = 'document';
            fileIcon = '📘';
          } else if (['xls', 'xlsx'].includes(fileExtension)) {
            fileType = 'document';
            fileIcon = '📊';
          } else if (['ppt', 'pptx'].includes(fileExtension)) {
            fileType = 'document';
            fileIcon = '📋';
          } else if (['zip', 'rar', '7z'].includes(fileExtension)) {
            fileType = 'document';
            fileIcon = '🗜️';
          }

          const fileName = filePath.split('/').pop();
          const fileCaption = `${fileIcon} **Qo'shimcha fayl:** ${fileName}`;

          // Faylni alohida yuboramiz
          let fileResult;
          if (fileType === 'photo') {
            fileResult = await bot.sendPhoto(CHANNEL_ID, fullFilePath, {
              caption: fileCaption,
              parse_mode: 'Markdown'
            });
          } else if (fileType === 'video') {
            fileResult = await bot.sendVideo(CHANNEL_ID, fullFilePath, {
              caption: fileCaption,
              parse_mode: 'Markdown'
            });
          } else if (fileType === 'audio') {
            fileResult = await bot.sendAudio(CHANNEL_ID, fullFilePath, {
              caption: fileCaption,
              parse_mode: 'Markdown'
            });
          } else {
            // Barcha boshqa fayllar uchun document sifatida yuboramiz
            fileResult = await bot.sendDocument(CHANNEL_ID, fullFilePath, {
              caption: fileCaption,
              parse_mode: 'Markdown'
            });
          }

          console.log('Fayl yuborildi:', fileResult.message_id);
        }
      } catch (fileError) {
        console.log('Fayl yuborishda xatolik:', fileError.message);
        console.log('Fayl xatolik tafsilotlari:', {
          error: fileError,
          fileName: leadData.fileName,
          fileUrl: leadData.fileUrl ? 'mavjud' : 'yo\'q'
        });
      }
    }

    // Natijani qaytaramiz
    const result = arizaResult;

    console.log('Ariza Telegram kanalga yuborildi:', result.message_id);
    return { 
      success: true, 
      messageId: result.message_id,
      message: 'Ariza muvaffaqiyatli yuborildi'
    };

  } catch (error) {
    console.error('Telegram xabar yuborishda xatolik:', error);
    console.error('Xatolik tafsilotlari:', {
      message: error.message,
      code: error.code,
      response: error.response
    });
    return { 
      success: false, 
      message: 'Telegram xabar yuborishda xatolik: ' + error.message,
      error: error
    };
  }
}
