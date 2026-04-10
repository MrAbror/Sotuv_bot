# Telegram Sotuv Menejer Boti

Ushbu loyiha Node.js va [Telegraf](https://telegraf.js.org/) kutubxonasi yordamida yaratilgan Telegram sotuv boti hisoblanadi. Bot foydalanuvchilarga xizmatlar haqida ma'lumot beradi, narxlarni ko'rsatadi va buyurtma yig'ish tizimiga ega. Shuningdek, /admin komandasi orqali statistika ko'rish imkoniyati mavjud.

## Talablar

* Node.js (v14+)
* Telegram Bot API Tokeni (BotFather orqali olinadi)

## O'rnatish

1. Loyiha papkasiga kiring:
   ```bash
   cd Sotuv_bot
   ```

2. Kerakli paketlarni o'rnating:
   ```bash
   npm install
   ```

3. `.env` faylini sozlang:
   Loyiha papkasida `.env` faylini oching va unga kerakli qiymatlarni tahrirlab yozib chiqing:
   ```env
   BOT_TOKEN=sizning_bot_tokeningiz
   ADMIN_CHAT_ID=sizning_telegram_id_raqamingiz
   ```
   *(Telegram ID ni aniqlash uchun @userinfobot kabi botlardan foydalanishingiz mumkin)*

## Ishga Tushirish

Botni ishga tushirish uchun quyidagi komandani kiriting:

```bash
npm start
```

Yoki:

```bash
node bot.js
```

Bot terminalida `==> Bot muvaffaqiyatli ishga tushdi va ishlashga tayyor! <==` degan yozuv chiqsa, bu barchasi to'g'ri sozlanganini bildiradi.

## Imkoniyatlari

* Bosh menyu:`Xizmatlarimiz`, `Narxlar`, `Buyurtma berish`, `Bog'lanish`, `Savollar` tugmalarini o'z ichiga oladi.
* **Xizmatlarimiz:** Bot, web-sayt va SMM uchun xizmatlar ro'yxatini chiqaradi va har biriga bosganda maxsus inline keyboard orqali ma'lumot beradi.
* **Narxlar:** Xizmatlarning boshlang'ich narxlarini ko'rsatadi va ular orqali to'g'ridan-to'g'ri buyurtma sahifasiga o'tadi.
* **Buyurtma berish:** Multi-step wizard orqali (ism, tel raqam, xizmat turi, va izoh) so'rovnoma o'tkazadi va shakllangan natijani `.env` dagi adminga yetkazadi.
* **Admin Paneli:** Faqat ruxsat berilgan `ADMIN_CHAT_ID` egasi larda ishlaydigan `/admin` komandasi orqali botdagi unikal foydalanuvchilar va umumiy buyurtmalar soni haqida ma'lumot olish mumkin.
