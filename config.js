require("dotenv").config();

function parseList(str) {
  return (str || "").split(",").map((s) => s.trim()).filter(Boolean);
}

const config = {
  // Agar .env faylida ma'lumot bo'lmasa, shu yerdagi qo'shtirnoq ichidagi qiymatlarni oladi
  botToken: process.env.BOT_TOKEN || "8838420070:AAGMluZxb7YmLbYjT8UF--cpZeCoH1DvZEE",
  botUsername: (process.env.BOT_USERNAME || "@shaxastars1_bot").replace("@", ""),
  requiredChannels: parseList(process.env.REQUIRED_CHANNELS || "@forme_o"),
  adminIds: parseList(process.env.ADMIN_IDS || "6044128901").map(Number),
  card: {
    number: process.env.CARD_NUMBER || "9860350140432864",
    owner: process.env.CARD_OWNER || "Alamov Shohruh",
  },
  // 1 dona Telegram Stars narxi (so'm hisobida). Screenshotdagi narxlarga mos: 217 so'm/dona
  starRateSom: 217,
};

if (!config.botToken) {
  console.error("XATOLIK: .env faylida BOT_TOKEN ko'rsatilmagan! .env.example faylidan nusxa oling.");
  process.exit(1);
}
if (config.requiredChannels.length === 0) {
  console.warn("OGOHLANTIRISH: REQUIRED_CHANNELS bo'sh -- obunani majburiy tekshirish o'chiq bo'ladi.");
}
if (config.adminIds.length === 0) {
  console.warn("OGOHLANTIRISH: ADMIN_IDS bo'sh -- to'lovlarni va buyurtmalarni hech kim tasdiqlay olmaydi!");
}

module.exports = config;
