# ⭐ Stars Shop Bot

Telegram orqali **Stars / Premium / PUBG UC / Gift** sotadigan bot. To'lovlar **qo'lda** (karta orqali, skrinshot bilan) tasdiqlanadi — xuddi screenshotlardagi bot kabi.

## Qanday ishlaydi

1. Foydalanuvchi `/start` bosadi → kanal(lar)ga obuna bo'lishi so'raladi.
2. "✅ Tekshirish" tugmasini bosadi → obuna bo'lgan bo'lsa, asosiy menyu ochiladi; bo'lmasa, yana "qo'shiling" deyiladi.
3. Menyudan mahsulot tanlaydi (Stars/Premium/UC/Gift/Kanal postiga Stars) → narx balansdan yechiladi.
4. Balans yetmasa — "Hisobni to'ldirish" tugmasi chiqadi: karta raqami ko'rsatiladi → foydalanuvchi to'lab, skrinshot yuboradi.
5. Skrinshot **sizga (admin)** shaxsiy xabar sifatida yuboriladi, "✅ Tasdiqlash / ❌ Rad etish" tugmalari bilan.
6. Tasdiqlasangiz — foydalanuvchi balansi avtomatik to'ldiriladi. Rad etsangiz — foydalanuvchiga xabar boradi.
7. Har bir xarid ham xuddi shunday — sizga buyurtma keladi, siz haqiqiy Stars/Premium/Gift/UC'ni qo'lda yuboргandan so'ng "✅ Bajarildi" bosasiz.

Ya'ni: **bot faqat menyu, balans va tasdiqlash oqimini avtomatlashtiradi** — real Stars/Premium/Gift/UC'ni odam (siz) qo'lda yuborasiz, xuddi aytganingizdek.

## 1-qadam: Bot yaratish

1. Telegram'da [@BotFather](https://t.me/BotFather) ga yozing → `/newbot` → nom va username bering.
2. Sizga **token** beriladi (masalan `123456:ABC-...`) — buni saqlab qo'ying.

## 2-qadam: Botni kanalga admin qilib qo'shish

**MUHIM:** Obunani tekshirish (`getChatMember`) ishlashi uchun bot majburiy kanalda **ADMIN** bo'lishi kerak (oddiy a'zo emas). Kanal sozlamalari → Administrators → botni qo'shing (maxsus huquq shart emas, shunchaki admin bo'lsa bo'ldi).

## 3-qadam: `.env` faylini to'ldirish

`.env.example` faylidan nusxa oling va nomini `.env` ga o'zgartiring:

```bash
cp .env.example .env
```

So'ng `.env` faylini oching va to'ldiring:

- `BOT_TOKEN` — BotFather'dan olgan token
- `BOT_USERNAME` — bot username'i, `@` belgisisiz
- `REQUIRED_CHANNELS` — majburiy kanal(lar), masalan `@mening_kanalim` (bir nechta bo'lsa vergul bilan: `@kanal1,@kanal2`)
- `ADMIN_IDS` — sizning (va boshqa adminlarning) Telegram **ID raqamingiz** (username emas!). O'z ID'ingizni bilish uchun [@userinfobot](https://t.me/userinfobot) ga `/start` yozing.
- `CARD_NUMBER`, `CARD_OWNER` — to'lov qabul qilinadigan haqiqiy karta raqamingiz va egasining ismi

## 4-qadam: O'rnatish va ishga tushirish

```bash
npm install
npm start
```

Konsolda `✅ Bot ishga tushdi!` yozuvini ko'rsangiz — bot ishlayapti. Botga Telegram'da `/start` yozib sinab ko'ring.

### Doimiy ishlashi uchun (serverda / VPS'da)

```bash
npm install -g pm2
pm2 start bot.js --name stars-bot
pm2 save
```

## Narxlarni o'zgartirish

Barcha narxlar **`catalogs.js`** faylida:

- Stars narxi — `config.js` ichidagi `starRateSom` (1 dona narxi, so'mda). Hozir 217 so'm/dona (screenshotdagi narxlarga mos).
- Premium, PUBG UC paketlari va narxlari — `catalogs.js` ichida ro'yxat, bemalol o'zgartiring/qo'shing/o'chiring.
- Gift katalogi — xuddi shu faylda, screenshotdagi narxlar bilan tayyor turadi.

## Fayl tuzilishi

```
bot.js            — botning asosiy mantiqi (menyu, xaridlar, admin tasdiqlash)
config.js         — .env'dan sozlamalarni o'qiydi
catalogs.js       — mahsulotlar va narxlar (shu yerni tez-tez tahrirlaysiz)
db.js             — oddiy JSON-fayl bazasi (db.json avtomatik yaratiladi)
keyboards.js      — tugmalar (klaviaturalar)
subscription.js   — kanalga obunani tekshirish
utils.js          — kichik yordamchi funksiyalar
```

Ma'lumotlar `db.json` faylida saqlanadi (foydalanuvchilar, buyurtmalar, to'lovlar). Bu faylni vaqti-vaqti bilan **backup** qilib turing — o'chib qolsa, barcha balanslar yo'qoladi.

## Admin panel

Admin (ya'ni `ADMIN_IDS`da ko'rsatilgan ID) botga `/admin` deb yozsa, admin panel ochiladi:

- **💰 Balansni o'zgartirish** — istalgan foydalanuvchining (ID yoki @username orqali) balansini yangi qiymatga o'rnatadi. Xato kiritib qo'ysangiz, buyruqni qayta bosib to'g'rilashingiz mumkin.
- **🧹 Balansni 0 qilish** — tez orada bitta bosishda foydalanuvchi balansini nolga tushiradi.
- **🚫 Bloklash / ✅ Blokdan chiqarish** — foydalanuvchini botdan butunlay foydalanishdan to'xtatadi (yoki qaytadan ruxsat beradi). Bloklangan foydalanuvchiga shu haqda xabar ketadi.
- **🛠 Texnik ishlar rejimi** — yoqilganda, barcha (admin bo'lmagan) foydalanuvchilarga avtomatik xabar boradi ("texnik ishlar olib borilmoqda") va bot ular uchun vaqtincha ishlamay turadi; admin esa botdan foydalanishda davom etaveradi.
- **📢 Xabar yuborish** — kiritgan matningizni barcha foydalanuvchilarga yuboradi (umumiy e'lonlar uchun).
- **📊 Statistika** — jami foydalanuvchilar, bloklanganlar, buyurtmalar va tushum bo'yicha qisqacha hisobot.

## "Avto" to'lov haqida

Hozircha "Karta orqali (avto)" tugmasi shunchaki "tez kunda" degan xabar beradi — chunki avtomatik to'lov uchun Click.uz/Payme kabi to'lov tizimining **Merchant API** kalitlari kerak bo'ladi, bu sizning tomoningizdan alohida ro'yxatdan o'tish talab qiladi. Kalitlarni olsangiz, shu qism ustiga ularning API'sini ulash mumkin.

## Diqqat

- `config.js` faylida token, karta raqami va admin ID zaxira (fallback) qiymat sifatida yozilgan — bu qulay, lekin agar loyihani birov bilan bo'lishsangiz yoki GitHub'ga (ochiq repo sifatida) yuklasangiz, shularni ko'rib qolishi mumkin. Eng xavfsizi — bu qiymatlarni faqat `.env` faylida saqlash va `config.js`dagi standart qiymatlarni o'chirib tashlash.
- `ADMIN_IDS` ga faqat o'zingiz ishonadigan odamlarning ID'sini qo'ying — ular to'lovlarni tasdiqlay oladi va foydalanuvchilar balansini o'zgartira oladi.
- Telegram Stars/Premium/Gift'larni norasmiy usulda (Telegram'ning o'z to'lov tizimidan tashqari) sotish/sotib olish Telegram foydalanish shartlariga zid bo'lishi mumkin, shuningdek pul o'tkazmalari bilan bog'liq mahalliy qonunchilikka ham rioya qilish tavsiya etiladi — bu masalalarni o'zingiz aniqlashtirib olishingiz maqsadga muvofiq (men huquqshunos emasman, shuning uchun aniq maslahat berolmayman).
# stars-bot
# stars
# stars
