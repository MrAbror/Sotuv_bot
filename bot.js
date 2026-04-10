require('dotenv').config();
const { Telegraf, session, Scenes, Markup } = require('telegraf');

// .env faylidan o'zgaruvchilarni yuklash
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

if (!BOT_TOKEN) {
    console.error("XATOLIK: BOT_TOKEN topilmadi. Iltimos .env faylini tekshiring.");
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// --- STATISTIKA UCHUN O'ZGARUVCHILAR ---
// Eslatma: Oddiy bo'lishi uchun xotirada saqlanyapti.
const totalUsers = new Set();
let totalOrders = 0;


// --- BUYURTMA QABUL QILISH WIZARD SAHNASI ---
const orderWizard = new Scenes.WizardScene(
    'order-wizard',
    (ctx) => {
        ctx.reply("Iltimos, ismingizni kiriting:");
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.name = ctx.message.text;
        ctx.reply("Telefon raqamingizni kiriting:\n(Masalan: +998901234567)");
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.phone = ctx.message.text;
        ctx.reply("Qaysi xizmat kerak?\n(Masalan: Telegram bot, Veb-sayt, SMM)");
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.service = ctx.message.text;
        ctx.reply("Qo'shimcha izohingiz bormi? (Loyihangiz haqida yozing yoki 'yozishni hohlamayman' deb yozing)");
        return ctx.wizard.next();
    },
    async (ctx) => {
        ctx.wizard.state.comment = ctx.message.text;
        totalOrders++; // Buyurtma sonini oshirish

        ctx.reply("Buyurtmangiz qabul qilindi! Tez orada aloqaga chiqamiz.");

        // Adminga xabar yuborish formatlanishi
        const username = ctx.from.username ? `@${ctx.from.username}` : "Kiritilmagan";
        const adminMsg = `🟢 YANGI BUYURTMA!\n\n` +
            `👤 Ism: ${ctx.wizard.state.name}\n` +
            `📞 Telefon: ${ctx.wizard.state.phone}\n` +
            `🛠 Xizmat: ${ctx.wizard.state.service}\n` +
            `📝 Izoh: ${ctx.wizard.state.comment}\n` +
            `🔗 Username: ${username}`;

        if (ADMIN_CHAT_ID) {
            try {
                await ctx.telegram.sendMessage(ADMIN_CHAT_ID, adminMsg);
            } catch (err) {
                console.error("Adminga xabar yuborishda xatolik:", err);
            }
        } else {
            console.warn("DIQQAT: ADMIN_CHAT_ID .env da yo'q, xabar yetkazilmadi!");
        }

        // Sahnadan chiqish
        return ctx.scene.leave();
    }
);

// Sahnani ishga tushirish (Stage)
const stage = new Scenes.Stage([orderWizard]);

// Botga session va stageni ulash
bot.use(session());
bot.use(stage.middleware());

// --- BOSH MENYU VA SALOMLASHISH (/start komandasi) ---
bot.start((ctx) => {
    // Foydalanuvchini ro'yxatga qo'shib qo'yish
    totalUsers.add(ctx.from.id);

    ctx.reply(
        "Salom! Bizning xizmatlar botiga xush kelibsiz.\nQuyidagi menyudan o'zingizga kerakli bo'limni tanlang:",
        Markup.keyboard([
            ['🛠 Xizmatlarimiz', '💰 Narxlar'],
            ['📝 Buyurtma berish', '📞 Bog\'lanish'],
            ['❓ Savollar']
        ]).resize() // Klaviatura o'lchamini ekranga moslash
    );
});

// --- ADMIN KOMANDASI (/admin) ---
bot.command('admin', (ctx) => {
    // Faqat id si mos tushganlar kira oladi
    if (ctx.from.id.toString() === ADMIN_CHAT_ID) {
        ctx.reply(`📊 Bot statistikasi:\n\n👥 Foydalanuvchilar (Unikal): ${totalUsers.size}\n🛍 Buyurtmalar soni: ${totalOrders}`);
    } else {
        ctx.reply("Kechirasiz, sizda admin huquqi yo'q!");
    }
});

// --- 1. XIZMATLARIMIZ TUGMASI ---
bot.hears('🛠 Xizmatlarimiz', (ctx) => {
    ctx.reply(
        'Bizning asosiy xizmatlarimiz:\n\n' +
        '🤖 Telegram bot yasash — "Sizning biznesingiz uchun bot yasab beramiz"\n' +
        '🌐 Veb-sayt yasash — "Zamonaviy veb-sayt yasab beramiz"\n' +
        '📈 SMM xizmati — "Ijtimoiy tarmoqlarni boshqaramiz"\n\n' +
        'Batafsil ma\'lumot o\'qish uchun quyidagi tugmalarni bosing:',
        Markup.inlineKeyboard([
            [Markup.button.callback('Telegram bot yasash', 'info_bot')],
            [Markup.button.callback('Veb-sayt yasash', 'info_web')],
            [Markup.button.callback('SMM xizmati', 'info_smm')]
        ])
    );
});

// --- 2. NARXLAR TUGMASI ---
bot.hears('💰 Narxlar', (ctx) => {
    ctx.reply(
        'Bizning xizmatlar narxi:\n\n' +
        '🤖 Telegram bot: 200 dollardan\n' +
        '🌐 Veb-sayt: 300 dollardan\n' +
        '📈 SMM: oyiga 150 dollar\n\n',
        Markup.inlineKeyboard([
            [Markup.button.callback('Buyurtma berish (Bot)', 'order_action')],
            [Markup.button.callback('Buyurtma berish (Veb-sayt)', 'order_action')],
            [Markup.button.callback('Buyurtma berish (SMM)', 'order_action')]
        ])
    );
});

// --- 3. BUYURTMA BERISH TUGMASI ---
bot.hears('📝 Buyurtma berish', (ctx) => {
    // Sahnani ishga tushirish (order-wizard ga ulanish)
    ctx.scene.enter('order-wizard');
});

// --- 4. BOG'LANISH TUGMASI ---
bot.hears('📞 Bog\'lanish', (ctx) => {
    ctx.reply(
        'Barcha savollar va takliflar bo\'yicha biz bilan bog\'lanishingiz mumkin:\n\n' +
        '📱 Telegram: https://t.me/abror_od1lov\n' +
        '📞 Telefon: +998501111781\n' +
        '🕒 Ish vaqti: 09:00 — 18:00'
    );
});

// --- 5. SAVOLLAR TUGMASI ---
bot.hears('❓ Savollar', (ctx) => {
    ctx.reply(
        'Ko\'p beriladigan savollar va ularning javoblari:\n\n' +
        '❓ "Qancha vaqtda tayyor bo\'ladi?"\n' +
        '💬 "3 kundan 14 kungacha"\n\n' +
        '❓ "To\'lov qanday qilinadi?"\n' +
        '💬 "Yarmi oldindan, yarmi keyin"\n\n' +
        '❓ "Kafolat bormi?"\n' +
        '💬 "Ha, 30 kun bepul tuzatamiz"'
    );
});

// --- INLINE TUGMALAR HODISALARINI QAYTA ISHLASH (Xizmatlar haqida) ---
bot.action('info_bot', (ctx) => {
    ctx.answerCbQuery(); // Loading tugmachasini to'xtatish
    ctx.reply("🤖 Telegram bot yasash: Loyiha yoki biznesingiz jarayonlarini avtomatlashtirish, mijozlar bilan ishlash uchun Telegram botlar yaratib beramiz.");
});

bot.action('info_web', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply("🌐 Veb-sayt yasash: Korxonangizning internetdagi yuzini yaratish (Landing page, internet do'kon, koperativ ko'rinish va h.k).");
});

bot.action('info_smm', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply("📈 SMM xizmati: Mahsulotlaringizni ijtimoiy tarmoqlarda reklama qilish, professional postlar dizayni va savdoni oshirish xizmati.");
});

// Har qanday Buyurtma berish (inline tugmalar orqali) ni bosganda ham shu wizardga o'tish
bot.action('order_action', (ctx) => {
    ctx.answerCbQuery();
    ctx.scene.enter('order-wizard');
});

// --- BOTNI ISHGA TUSHIRISH ---
bot.launch().then(() => {
    console.log("==> Bot muvaffaqiyatli ishga tushdi va ishlashga tayyor! <==");
}).catch(err => {
    console.error("XATOLIK: Bot ishga tushmadi, sababi:", err);
});

// Xavfsiz chiqishni ta'minlash (Graceful stop)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
