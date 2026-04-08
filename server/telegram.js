import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { storage } from './storage.js';

let botInstance = null;
const userStates = {}; // chatId -> state

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7760232716:AAGGCTRhZ0FIi2lotNB4DJ6b6H92u--i1_Q';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || null;

export function setupTelegramBot() {
  if (!BOT_TOKEN) return;

  try {
    if (!botInstance) {
      botInstance = new TelegramBot(BOT_TOKEN, { polling: true });
      console.log('Telegram bot polling started');

      // Catch polling errors to prevent node crashes
      botInstance.on("polling_error", (error) => {
        console.error('Telegram Polling Error:', error.message || error);
      });

      botInstance.on("error", (error) => {
        console.error('Telegram Bot Error:', error.message || error);
      });

      botInstance.on("webhook_error", (error) => {
        console.error('Telegram Webhook Error:', error.message || error);
      });
    }
  } catch (error) {
    console.error('CRITICAL: Failed to initialize Telegram bot:', error.message);
    botInstance = null;
    return;
  }

  if (!botInstance) return;

  // Add /start command handler
  botInstance.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    userStates[chatId] = { step: 'home' };
    const resp = "Salom! Men SAYD.X loyihasining admin botiman. 🚀\n\nIltimos, nima qilmoqchi ekanligingizni quyidagi tugmalardan tanlang:";

    const options = {
      parse_mode: 'HTML',
      reply_markup: {
        keyboard: [
          [{ text: "📝 Ariza qoldirish" }],
          [{ text: "❓ Savol yo'llash" }]
        ],
        resize_keyboard: true
      }
    };

    botInstance.sendMessage(chatId, resp, options);
  });

  // Handle incoming text messages for questions/leads
  botInstance.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || '';

    if (text.startsWith('/')) return;

    // Handle Admin Reply -> User (Native swipe to reply)
    if (String(chatId) === String(CHANNEL_ID) && msg.reply_to_message) {
      const replyText = msg.reply_to_message.text || msg.reply_to_message.caption || '';

      // Yangi formatdagi savollarga javob berish
      const qMatch = replyText.match(/#q_([a-f0-9-]+)/);
      if (qMatch && text) {
        const questionId = qMatch[1];
        const q = (await storage.getQuestions()).find(x => x.id === questionId);
        if (q) {
          await storage.updateQuestionReply(questionId, text);
          if (q.telegramChatId) {
            await botInstance.sendMessage(q.telegramChatId, `🔔 <b>SAYD.X Administrator:</b>\n\n💬 <b>Savolingiz:</b> ${q.text}\n\n✅ <b>Javob:</b> ${text}`, { parse_mode: 'HTML' }).catch(e => console.error(e.message));
          }
          await botInstance.sendMessage(chatId, "✅ Savolga javob yuborildi va saytga joylandi!");
        } else {
          await botInstance.sendMessage(chatId, "❌ Savol bazadan topilmadi.");
        }
        return;
      }

      // Native reply for Leads (Arizalar)
      const leadMatch = replyText.match(/ID:\s*([a-f0-9-]{36})/i);
      if (leadMatch && text) {
        const leadId = leadMatch[1];
        const lead = await storage.getLead(leadId);
        if (lead) {
          await storage.updateLeadReply(leadId, text);
          if (lead.telegramChatId) {
            await botInstance.sendMessage(lead.telegramChatId, `🔔 <b>SAYD.X Administrator:</b>\n\n💬 <b>Murojaatingiz:</b> ${lead.description || lead.serviceType}\n\n✅ <b>Javob:</b> ${text}`, { parse_mode: 'HTML' }).catch(e => console.error(e.message));
          }
          await botInstance.sendMessage(chatId, "✅ Arizaga javob yuborildi!");
        } else {
          await botInstance.sendMessage(chatId, "❌ Ariza bazadan topilmadi.");
        }
        return;
      }

      // Eski format compatibility
      const oldMatch = replyText.match(/#user_(\d+)/);
      if (oldMatch && text) {
        const targetUserId = oldMatch[1];
        await botInstance.sendMessage(targetUserId, `👨‍💻 <b>SAYD.X Admin:</b>\n\n${text}`, { parse_mode: 'HTML' }).catch(e => console.error(e));
        await botInstance.sendMessage(chatId, "✅ Javob yuborildi.");
        return;
      }
    }

    // Handle user selections
    if (text === "📝 Ariza qoldirish") {
      userStates[chatId] = { step: 'waiting_for_name' };
      botInstance.sendMessage(chatId, "Iltimos, Ism-familiyangizni kiriting:", { reply_markup: { remove_keyboard: true } });
      return;
    }

    if (text === "❓ Savol yo'llash") {
      userStates[chatId] = { step: 'waiting_for_question' };
      botInstance.sendMessage(chatId, "Iltimos, savolingizni yozib yuboring:", { reply_markup: { remove_keyboard: true } });
      return;
    }

    // Handle step-by-step inputs
    const userState = userStates[chatId];
    if (!userState) return;

    if (userState.step === 'waiting_for_question' && text) {
      const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const question = await storage.createQuestion({
        telegramChatId: String(chatId),
        name: msg.from.first_name || msg.from.username || 'Mijoz',
        text,
        status: 'pending'
      });

      if (CHANNEL_ID) {
        const adminMessage = `❓ <b>Botdan Yangi Savol!</b>\n\n👤 <b>Mijoz:</b> ${msg.from.first_name || ''} (@${msg.from.username || 'user'})\n💬 <b>Savol:</b> ${safeText}\n\n<i>Jadvalga yoki tugmaga bosmasdan ham "Reply" orqali javob qaytarishingiz mumkin.</i>\n\n<span class="tg-spoiler">#q_${question.id}</span>`;
        await botInstance.sendMessage(CHANNEL_ID, adminMessage, {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                { text: "✅ Tasdiqlash", callback_data: `replyq_${question.id}` },
                { text: "❌ Rad etish", callback_data: `rejectq_${question.id}` }
              ]
            ]
          }
        });
      }
      botInstance.sendMessage(chatId, "Savolingiz adminga yuborildi. Tez orada javob qaytaramiz! Bosh menyuga qaytish uchun /start ni bosing.");
      userStates[chatId] = { step: 'home' };
      return;
    }

    if (userState.step === 'answering_question' && text) {
      const questionId = userState.itemId;
      const q = (await storage.getQuestions()).find(x => x.id === questionId);
      if (q) {
        await storage.updateQuestionReply(questionId, text);
        if (q.telegramChatId) {
          await botInstance.sendMessage(q.telegramChatId, `🔔 <b>SAYD.X Administrator:</b>\n\n💬 <b>Savolingiz:</b> ${q.text}\n\n✅ <b>Javob:</b> ${text}`, { parse_mode: 'HTML' }).catch(e => console.error(e.message));
        }
        await botInstance.sendMessage(chatId, "✅ Savolga javob yuborildi va saytga joylandi!");
      } else {
        await botInstance.sendMessage(chatId, "❌ Savol topilmadi.");
      }
      userStates[chatId] = { step: 'home' };
      return;
    }

    if (userState.step === 'answering_lead' && text) {
      const leadId = userState.itemId;
      const lead = await storage.getLead(leadId);
      if (lead) {
        await storage.updateLeadReply(leadId, text);
        if (lead.telegramChatId) {
          await botInstance.sendMessage(lead.telegramChatId, `🔔 <b>SAYD.X Administrator:</b>\n\n💬 <b>Murojaatingiz:</b> ${lead.description || lead.serviceType}\n\n✅ <b>Javob:</b> ${text}`, { parse_mode: 'HTML' }).catch(e => console.error(e.message));
        }
        await botInstance.sendMessage(chatId, "✅ Arizaga javob yuborildi!");
      } else {
        await botInstance.sendMessage(chatId, "❌ Ariza topilmadi.");
      }
      userStates[chatId] = { step: 'home' };
      return;
    }

    if (userState.step === 'waiting_for_name' && text) {
      userState.name = text;
      userState.step = 'waiting_for_phone';
      botInstance.sendMessage(chatId, "Rahmat! Endi telefon raqamingizni yuboring:", {
        reply_markup: {
          keyboard: [[{ text: "📞 Raqamni yuborish", request_contact: true }]],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
      return;
    }

    if (userState.step === 'waiting_for_phone' && (text || msg.contact)) {
      userState.phone = msg.contact ? msg.contact.phone_number : text;
      userState.step = 'waiting_for_service';
      botInstance.sendMessage(chatId, "Qaysi xizmat turiga qiziqyapsiz?", {
        reply_markup: {
          keyboard: [['Veb-sayt', 'Telegram Bot'], ['Mobil ilova', 'Boshqa']],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
      return;
    }

    if (userState.step === 'waiting_for_service' && text) {
      userState.service = text;
      userState.step = 'waiting_for_desc';
      botInstance.sendMessage(chatId, "Loyiha haqida batafsil ma'lumot yoki talablaringizni yozing:\n(Tashlab ketish uchun - jo'nating)", { reply_markup: { remove_keyboard: true } });
      return;
    }

    if (userState.step === 'waiting_for_desc' && text) {
      userState.desc = text;

      if (CHANNEL_ID) {
        const safeDesc = userState.desc.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Saqlash logic
        const telegramChatIdStr = String(chatId);
        const lead = await storage.createLead({
          name: userState.name,
          phone: userState.phone,
          serviceType: userState.service,
          description: userState.desc,
          source: "bot",
          telegramChatId: telegramChatIdStr,
          telegram: msg.from.username ? `@${msg.from.username}` : ''
        });

        const adminMessage = `📝 <b>Bot Orqali Ariza!</b>\n\n👤 <b>Mijoz:</b> ${userState.name} (@${msg.from.username || 'user'})\n📞 <b>Telefon:</b> ${userState.phone}\n🔧 <b>Xizmat:</b> ${userState.service}\n💬 <b>Tavsif:</b> ${safeDesc}`;

        const options = {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                { text: "✅ Jarayonga olish", callback_data: `accept_${lead.id}` },
                { text: "📞 Bog'lanildi", callback_data: `contacted_${lead.id}` }
              ],
              [
                { text: "✍️ Javob yozish", callback_data: `replyl_${lead.id}` },
                { text: "❌ Bekor qilish", callback_data: `cancel_${lead.id}` }
              ]
            ]
          }
        };

        await botInstance.sendMessage(CHANNEL_ID, adminMessage, options);
      }
      botInstance.sendMessage(chatId, "Arizangiz muvaffaqiyatli qabul qilindi. Tez orada bog'lanamiz! Bosh menyuga qaytish uchun /start ni bosing.");
      userStates[chatId] = { step: 'home' };
      return;
    }
  });

  botInstance.on('callback_query', async (query) => {
    try {
      const data = query.data; // e.g. "accept_ID", "contacted_ID", "cancel_ID"
      const chatId = query.message.chat.id;
      const messageId = query.message.message_id;
      const user = query.from;

      const actionParts = data.split('_');
      const action = actionParts[0];
      const leadId = actionParts.slice(1).join('_');

      let newStatus = '';
      let statusText = '';

      if (action === 'replyq') {
        userStates[chatId] = { step: 'answering_question', itemId: leadId }; // Use itemId to be clear
        await botInstance.sendMessage(chatId, "👇 Iltimos, ushbu savolga javobingizni pastda yozing:");
        await botInstance.answerCallbackQuery(query.id);
        return;
      }

      if (action === 'replyl') {
        userStates[chatId] = { step: 'answering_lead', itemId: leadId };
        await botInstance.sendMessage(chatId, "👇 Iltimos, ushbu arizaga javobingizni pastda yozing:");
        await botInstance.answerCallbackQuery(query.id);
        return;
      }

      if (action === 'rejectq') {
        const questionId = leadId;
        const deleted = await storage.deleteQuestion(questionId);
        if (deleted) {
          await botInstance.editMessageText(query.message.text + "\n\n❌ <b>Rad etildi (O'chirildi)</b>", {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'HTML'
          }).catch(e => console.log(e));
          await botInstance.answerCallbackQuery(query.id, { text: "Savol o'chirildi" });
        } else {
          await botInstance.answerCallbackQuery(query.id, { text: "Xatolik: Savol topilmadi" });
        }
        return;
      }

      if (action === 'accept') {
        newStatus = 'in_progress';
        statusText = 'Jarayonda ⏳';
        const lead = await storage.getLead(leadId);
        if (lead && lead.telegramChatId) {
          botInstance.sendMessage(lead.telegramChatId, "ℹ️ <b>Sizning arizangiz jarayonga olindi!</b> Tez orada mutaxassislarimiz siz bilan bog'lanishadi.", { parse_mode: 'HTML' }).catch(e => console.log(e));
        }
      }
      else if (action === 'contacted') {
        newStatus = 'contacted'; statusText = "Bog'lanildi 📞";
        const lead = await storage.getLead(leadId);
        if (lead && lead.telegramChatId) {
          botInstance.sendMessage(lead.telegramChatId, "ℹ️ <b>Siz bilan bog'lanildi!</b> Agar qo'shimcha savollaringiz bo'lsa, ushbu bot orqali yo'llashingiz mumkin.", { parse_mode: 'HTML' }).catch(e => console.log(e));
        }
      }
      else if (action === 'cancel') { newStatus = 'completed'; statusText = 'Yakunlandi/Bekor qilindi ❌'; }

      if (newStatus) {
        await storage.updateLeadStatus(leadId, newStatus);

        let updatedText = query.message.text + `\n\n📌 <b>Holati:</b> ${statusText}\n👤 <b>Amal bajardi:</b> ${user.first_name || ''} ${user.last_name || ''} (@${user.username || 'user'})`;

        await botInstance.editMessageText(updatedText, {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'HTML',
          reply_markup: { inline_keyboard: [] }
        });

        await botInstance.answerCallbackQuery(query.id, { text: "Holati o'zgartirildi: " + statusText });
      }
    } catch (err) {
      console.error('Error handling callback_query', err);
    }
  });
}

// Vercel uchun - har safar yangi bot instance yaratamiz
export async function sendLeadToTelegram(leadData) {
  console.log('sendLeadToTelegram chaqirildi');

  // To'g'ridan-to'g'ri kodga kiritilgan qiymatlar (fallback)
  if (!BOT_TOKEN) {
    console.log('Telegram bot sozlanmagan');
    return { success: false, message: 'Telegram bot sozlanmagan' };
  }

  const bot = botInstance || new TelegramBot(BOT_TOKEN, { polling: false });
  console.log('Telegram bot ishga tushirildi');
  console.log('Bot instance yaratildi:', !!bot);

  try {
    // Agar kanal/chat ID berilmagan bo'lsa, ariza matnini yubormaymiz, faqat terminalga chiqaramiz
    if (!CHANNEL_ID) {
      console.log('Kanal ID belgilanmagan, Telegramga yuborish bekor qilindi. Ariza qabul qilindi.');
      return { success: true, messageId: null, message: 'Telegram Chat ID belgilanmagan, faqat bazaga saqlandi' };
    }

    // Ariza ma'lumotlarini formatlaymiz
    const safeDesc = leadData.description ? leadData.description.replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
    const message = `
🆕 <b>Yangi Ariza yuborildi!</b>

👤 <b>Mijoz:</b> ${leadData.name}
📞 <b>Telefon:</b> ${leadData.phone}
${leadData.telegram ? `📱 <b>Telegram:</b> @${leadData.telegram.replace('@', '')}` : ''}
🔧 <b>Xizmat:</b> ${leadData.serviceType}
${leadData.budget ? `💰 <b>Byudjet:</b> ${leadData.budget}` : ''}
${leadData.timeline ? `⏰ <b>Muddat:</b> ${leadData.timeline}` : ''}
${safeDesc ? `📝 <b>Tavsif:</b> ${safeDesc}` : ''}
${leadData.fileUrl ? `📎 <b>Qo'shimcha fayl:</b> ${leadData.fileUrl.split('/').pop()}` : ''}

🕐 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}
🆔 <b>ID:</b> ${leadData.id}
    `.trim();

    // Avval ariza matnini yuboramiz
    console.log('Xabar yuborishga harakat qilinmoqda...');
    console.log('Xabar matni:', message);
    console.log('Kanal ID:', CHANNEL_ID);

    const options = {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Jarayonga olish", callback_data: `accept_${leadData.id}` },
            { text: "📞 Bog'lanildi", callback_data: `contacted_${leadData.id}` }
          ],
          [
            { text: "✍️ Javob yozish", callback_data: `replyl_${leadData.id}` },
            { text: "❌ Bekor qilish", callback_data: `cancel_${leadData.id}` }
          ]
        ]
      }
    };

    const arizaResult = await bot.sendMessage(CHANNEL_ID, message, options);

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

export async function sendQuestionToTelegram(question) {
  if (!BOT_TOKEN) return { success: false, message: 'Telegram bot sozlanmagan' };
  const bot = botInstance || new TelegramBot(BOT_TOKEN, { polling: false });

  if (!CHANNEL_ID) return { success: true, message: 'Telegram Chat ID belgilanmagan' };

  try {
    const safeText = question.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const adminMessage = `❓ <b>Saytdan Yangi Savol!</b>\n\n👤 <b>Ism:</b> ${question.name}\n💬 <b>Savol:</b> ${safeText}\n\n<i>"Reply" orqali yoki pastdagi tugmani bosib javob yozing.</i>\n\n<span class="tg-spoiler">#q_${question.id}</span>`;
    const options = {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Tasdiqlash", callback_data: `replyq_${question.id}` },
            { text: "❌ Rad etish", callback_data: `rejectq_${question.id}` }
          ]
        ]
      }
    };
    await bot.sendMessage(CHANNEL_ID, adminMessage, options);
    return { success: true };
  } catch (err) {
    console.error("sendQuestionToTelegram error:", err);
    return { success: false, error: err.message };
  }
}
