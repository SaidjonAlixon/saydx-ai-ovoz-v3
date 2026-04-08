# Telegram Bot Sozlash

Arizalarni Telegram kanalga yuborish uchun quyidagi qadamlar:

## 1. Telegram Bot Yaratish

1. Telegram'da @BotFather ga yozing
2. `/newbot` buyrug'ini yuboring
3. Bot nomini kiriting (masalan: "MaqsadSAYD Bot")
4. Bot username'ini kiriting (masalan: "maqsadsayd_bot")
5. Bot token'ini saqlang

## 2. Kanal Yaratish va Bot Qo'shish

1. Telegram'da yangi kanal yarating
2. Kanal nomini kiriting (masalan: "MaqsadSAYD Arizalar")
3. Kanal username'ini o'rnating (masalan: "@maqsadsayd_arizalar")
4. Kanalga bot'ni admin qilib qo'shing
5. Bot'ga xabar yuborish ruxsatini bering

## 3. Environment Variables Sozlash

`.env` fayl yarating va quyidagi ma'lumotlarni kiriting:

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHANNEL_ID=@maqsadsayd_arizalar
```

## 4. Kanal ID ni Topish

Agar kanal username ishlamasa, kanal ID ni topish uchun:

1. Kanalga @userinfobot ni qo'shing
2. Kanalda `/start` yuboring
3. Kanal ID ni oling (masalan: -1001234567890)

## 5. Test Qilish

Server'ni qayta ishga tushiring:

```bash
npm run dev
```

Ariza formasi orqali test ariza yuboring va Telegram kanalda xabar kelishini tekshiring.

## Xatoliklar

Agar xabar yuborilmasa:
- Bot token to'g'ri ekanligini tekshiring
- Kanal ID to'g'ri ekanligini tekshiring
- Bot kanalda admin ekanligini tekshiring
- Console'da xatolik xabarlarini ko'ring





