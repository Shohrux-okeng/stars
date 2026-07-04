const { Telegraf, Markup } = require("telegraf");
const config = require("./config");
const {
  ensureUser,
  getUser,
  getUserByUsername,
  getAllUsers,
  updateUser,
  setBalance,
  addBalance,
  isBlocked,
  blockUser,
  unblockUser,
  setReferrer,
  createOrder,
  getOrder,
  setOrderStatus,
  createTopup,
  getTopup,
  setTopupStatus,
  topUsers,
  countReferrals,
  getSettings,
  setMaintenanceMode,
  getStats,
} = require("./db");
const {
  starsMin,
  starsMax,
  starsPrice,
  premiumPlans,
  pubgPlans,
  giftCatalog,
} = require("./catalogs");
const {
  subscribeKeyboard,
  mainMenuKeyboard,
  backKeyboard,
  withdrawRecipientKeyboard,
  starsAmountKeyboard,
  premiumKeyboard,
  pubgKeyboard,
  giftKeyboard,
  topupMethodKeyboard,
  paidOrCancelKeyboard,
  adminTopupKeyboard,
  adminOrderKeyboard,
  profileKeyboard,
  adminPanelKeyboard,
} = require("./keyboards");
const { fmt } = require("./utils");
const { isSubscribedAll } = require("./subscription");

const bot = new Telegraf(config.botToken);

// ================= HOLAT MASHINASI (RAMda) =================
// Ko'p qadamli suhbatlar uchun (masalan: "miqdorni kiriting" -> keyingi xabar javob)
const state = {};
function setState(userId, step, data = {}) {
  state[userId] = { step, data };
}
function clearState(userId) {
  delete state[userId];
}
function getState(userId) {
  return state[userId];
}

function isAdmin(userId) {
  return config.adminIds.includes(userId);
}

// Admin panelda "foydalanuvchi ID yoki @username" so'ralganda ishlatiladi
function resolveUserQuery(text) {
  const trimmed = String(text).trim();
  if (/^\d+$/.test(trimmed)) {
    return getUser(Number(trimmed));
  }
  return getUserByUsername(trimmed);
}

// ================= OBUNA DARVOZASI =================

async function sendSubscribeGate(ctx) {
  await ctx.reply(
    `⚠️ Botdan foydalanish uchun quyidagi kanal(lar)ga obuna bo'ling:\n\n` +
      config.requiredChannels.map((c) => `• ${c}`).join("\n") +
      `\n\n✅ Obuna bo'lgandan so'ng, "Tekshirish" tugmasini bosing`,
    subscribeKeyboard()
  );
}

async function sendMainMenu(ctx, greet = false) {
  const user = ensureUser(ctx);
  if (greet) {
    await ctx.reply(
      `👋 Assalomu alaykum, ${user.firstName}!\n\n` +
        `Bot orqali:\n` +
        `⭐ Telegram Stars\n` +
        `💎 Telegram Premium\n` +
        `🎮 Pubg UC\n` +
        `🎁 Gift\n\n` +
        `va boshqa mahsulotlarni xarid qilishingiz mumkin.\n\n` +
        `👇 Quyidagi menyudan kerakligini tanlang`,
      mainMenuKeyboard()
    );
  } else {
    await ctx.reply(`🏠 Asosiy menyu`, mainMenuKeyboard());
  }
}

async function sendProfile(ctx) {
  const user = ensureUser(ctx);
  await ctx.reply(
    `👤 PROFIL\n\n` +
      `ID: ${user.id}\n` +
      `Ism: ${user.firstName}\n` +
      `Username: ${user.username ? "@" + user.username : "yo'q"}\n\n` +
      `💰 BALANS: ${fmt(user.balance)} so'm\n` +
      `⭐ Stars: ${user.starsBalance} ta\n\n` +
      `🧾 Jami buyurtmalar: ${user.totalOrders} ta\n` +
      `💸 Jami sarflangan: ${fmt(user.totalSpent)} so'm`,
    profileKeyboard()
  );
}

// ================= XARID / BUYURTMA MOTORI =================

async function notifyAdminsOrder(order, user) {
  const text =
    `🆕 Yangi buyurtma!\n\n` +
    `${order.detailsText}\n\n` +
    `Foydalanuvchi: ${user.firstName} (@${user.username || "yo'q"}, ID: ${user.id})\n` +
    `Narx: ${fmt(order.price)} so'm\n` +
    `Buyurtma ID: ${order.id}`;
  for (const adminId of config.adminIds) {
    await bot.telegram.sendMessage(adminId, text, adminOrderKeyboard(order.id)).catch(() => {});
  }
}

async function maybeReferralBonus(user, order) {
  if (!user.referredBy) return;
  const referrer = getUser(user.referredBy);
  if (!referrer) return;
  if (order.type === "stars") {
    const bonus = Math.max(1, Math.round((order.extra.amount || 0) * 0.01));
    updateUser(referrer.id, { starsBalance: referrer.starsBalance + bonus });
    await bot.telegram
      .sendMessage(referrer.id, `🎉 Taklif qilgan do'stingiz Stars sotib oldi!\n+${bonus} ⭐ bonus hisobingizga qo'shildi.`)
      .catch(() => {});
  } else if (order.type === "premium") {
    updateUser(referrer.id, { starsBalance: referrer.starsBalance + 5 });
    await bot.telegram
      .sendMessage(referrer.id, `🎉 Taklif qilgan do'stingiz Premium sotib oldi!\n+5 ⭐ bonus hisobingizga qo'shildi.`)
      .catch(() => {});
  }
}

async function tryPurchase(ctx, { type, price, detailsText, extra }) {
  const user = ensureUser(ctx);
  if (user.balance < price) {
    const missing = price - user.balance;
    await ctx.reply(
      `❌ Balansingiz yetarli emas!\n\n` +
        `Balans: ${fmt(user.balance)} so'm\n` +
        `Kerak: ${fmt(price)} so'm\n` +
        `Yetishmayapti: ${fmt(missing)} so'm\n\n` +
        `Hisobingizni to'ldiring 👇`,
      Markup.inlineKeyboard([[Markup.button.callback("➕ Hisobni to'ldirish", "topup_start")]])
    );
    return null;
  }
  updateUser(user.id, {
    balance: user.balance - price,
    totalOrders: user.totalOrders + 1,
    totalSpent: user.totalSpent + price,
  });
  const order = createOrder({ userId: user.id, type, price, detailsText, extra: extra || {} });
  await ctx.reply(
    `✅ Buyurtma qabul qilindi!\n\n${detailsText}\nNarx: ${fmt(price)} so'm\n\n` +
      `Buyurtmangiz tez orada bajariladi.\nBuyurtma raqami: ${order.id}`,
    mainMenuKeyboard()
  );
  await notifyAdminsOrder(order, getUser(user.id));
  await maybeReferralBonus(getUser(user.id), order);
  return order;
}

async function finalizeStarsPurchase(ctx, amount) {
  if (!Number.isFinite(amount) || amount < starsMin || amount > starsMax) {
    return ctx.reply(`❌ Miqdor ${starsMin} dan ${starsMax} gacha bo'lishi kerak.`);
  }
  const price = starsPrice(amount);
  return tryPurchase(ctx, {
    type: "stars",
    price,
    detailsText: `⭐ ${amount} ta Telegram Stars`,
    extra: { amount },
  });
}

// ================= /start VA OBUNA TEKSHIRUVI =================

// --- 1) Bloklangan foydalanuvchilar: HAMMA narsadan oldin tekshiriladi ---
bot.use(async (ctx, next) => {
  if (!ctx.from) return next();
  if (isAdmin(ctx.from.id)) return next();
  if (isBlocked(ctx.from.id)) {
    if (ctx.updateType === "callback_query") {
      return ctx.answerCbQuery("🚫 Siz botdan foydalanish huquqidan mahrum qilingansiz.", { show_alert: true });
    }
    return ctx.reply(
      "🚫 Siz botdan foydalanish huquqidan mahrum qilingansiz.\n\nBu xato deb hisoblasangiz, admin bilan bog'laning."
    );
  }
  return next();
});

// --- 2) Texnik ishlar rejimi: bloklashdan keyin, /start'dan oldin tekshiriladi ---
bot.use(async (ctx, next) => {
  if (!ctx.from) return next();
  if (isAdmin(ctx.from.id)) return next();
  const settings = getSettings();
  if (settings.maintenanceMode) {
    if (ctx.updateType === "callback_query") {
      return ctx.answerCbQuery("🛠 Hozirda texnik ishlar olib borilmoqda. Keyinroq urinib ko'ring.", { show_alert: true });
    }
    return ctx.reply(
      "🛠 Hozirda botimizga texnik ishlar olib borilmoqda.\n\nIltimos, birozdan so'ng qayta urinib ko'ring. Tushunganingiz uchun rahmat!"
    );
  }
  return next();
});

bot.start(async (ctx) => {
  clearState(ctx.from.id);
  const user = ensureUser(ctx);
  const payload = ctx.startPayload; // masalan: ref_123456
  if (payload && payload.startsWith("ref_")) {
    const refId = Number(payload.slice(4));
    if (refId && refId !== user.id) setReferrer(user.id, refId);
  }
  const subscribed = await isSubscribedAll(bot, ctx.from.id);
  if (!subscribed) {
    return sendSubscribeGate(ctx);
  }
  return sendMainMenu(ctx, true);
});

bot.action("check_sub", async (ctx) => {
  const subscribed = await isSubscribedAll(bot, ctx.from.id);
  if (!subscribed) {
    return ctx.answerCbQuery("❌ Siz hali barcha kanallarga qo'shilmadingiz!", { show_alert: true });
  }
  await ctx.answerCbQuery("✅ Obuna tasdiqlandi!");
  await ctx.deleteMessage().catch(() => {});
  return sendMainMenu(ctx, true);
});

// ================= ADMIN PANEL: KIRISH =================

bot.command("admin", async (ctx) => {
  if (!isAdmin(ctx.from.id)) return; // oddiy foydalanuvchilarga sezilmasin ham
  clearState(ctx.from.id);
  const settings = getSettings();
  await ctx.reply("🛠 ADMIN PANEL", adminPanelKeyboard(settings.maintenanceMode));
});

// --- 3) Majburiy obuna: HAMMA qolgan handlerlar uchun (admin bundan mustasno) ---
bot.use(async (ctx, next) => {
  if (!ctx.from) return next();
  if (isAdmin(ctx.from.id)) return next();
  if (config.requiredChannels.length === 0) return next();
  const subscribed = await isSubscribedAll(bot, ctx.from.id);
  if (!subscribed) {
    if (ctx.updateType === "callback_query") {
      return ctx.answerCbQuery("❌ Avval kanal(lar)ga obuna bo'ling!", { show_alert: true });
    }
    return sendSubscribeGate(ctx);
  }
  return next();
});

// ================= ASOSIY MENYU (matnli tugmalar) =================

bot.hears("⬅️ Orqaga", async (ctx) => {
  clearState(ctx.from.id);
  return sendMainMenu(ctx);
});

bot.hears("⭐ Stars olish", async (ctx) => {
  clearState(ctx.from.id);
  await ctx.reply(
    `⭐ Telegram Stars buyurtma\n\nMinimal: ${starsMin}\nMaksimal: ${starsMax}\n\n` +
      `Kerakli miqdorni tanlang yoki raqam bilan yuboring`,
    starsAmountKeyboard()
  );
});

bot.hears("💎 Premium olish", async (ctx) => {
  clearState(ctx.from.id);
  await ctx.reply(`💎 Telegram Premium buyurtma\n\nKerakli muddatni tanlang:`, premiumKeyboard());
});

bot.hears("🎮 Pubg UC olish", async (ctx) => {
  clearState(ctx.from.id);
  await ctx.reply(`🎮 Pubg Mobile UC buyurtma\n\nKerakli paketni tanlang:`, pubgKeyboard());
});

bot.hears("🎁 Gift olish", async (ctx) => {
  clearState(ctx.from.id);
  await ctx.reply(
    `🎁 Telegram Gift xarid qilish\n\n` +
      `ℹ️ Giftni yuborish jarayoni admin profili orqali amalga oshiriladi\n\n` +
      `Iltimos, yuborish uchun kerakli Giftni tanlang`,
    giftKeyboard()
  );
});

bot.hears("📢 Kanal postiga Stars", async (ctx) => {
  setState(ctx.from.id, "channelpost_link");
  await ctx.reply(
    `📢 Kanal postiga Stars yuborish\n\nIltimos, post havolasini yuboring\n(masalan: https://t.me/kanalim/123)`,
    backKeyboard()
  );
});

bot.hears("📊 Top", async (ctx) => {
  const list = topUsers(10);
  if (list.length === 0) {
    return ctx.reply(`📊 Hozircha reyting bo'sh.`);
  }
  const text = list.map((u, i) => `${i + 1}. ${u.firstName || "Foydalanuvchi"} — ${fmt(u.totalSpent)} so'm`).join("\n");
  await ctx.reply(`📊 TOP xaridorlar:\n\n${text}`);
});

bot.hears("👤 Profil", async (ctx) => {
  await sendProfile(ctx);
});

// ================= INLINE TUGMALAR: NAVIGATSIYA =================

bot.action("back_menu", async (ctx) => {
  clearState(ctx.from.id);
  await ctx.answerCbQuery();
  return sendMainMenu(ctx);
});

bot.action("back_profile", async (ctx) => {
  await ctx.answerCbQuery();
  return sendProfile(ctx);
});

// ================= STARS =================

bot.action(/^stars_amt_(\d+)$/, async (ctx) => {
  const amount = Number(ctx.match[1]);
  await ctx.answerCbQuery();
  await finalizeStarsPurchase(ctx, amount);
});

bot.action("stars_custom", async (ctx) => {
  setState(ctx.from.id, "stars_custom");
  await ctx.answerCbQuery();
  await ctx.reply(`✏️ Boshqa miqdor kiritish\n\nMinimal: ${starsMin}\nMaksimal: ${starsMax}\n\nMiqdorni kiriting:`, backKeyboard());
});

// ================= PREMIUM =================
// Eslatma: Premium avtomatik balansdan yechilmaydi -- to'g'ridan-to'g'ri adminga yozish orqali kelishiladi.

bot.action(/^prem_(.+)$/, async (ctx) => {
  const plan = premiumPlans.find((p) => p.id === ctx.match[1]);
  await ctx.answerCbQuery();
  if (!plan) return;

  const text = `👋 Assalomu alaykum, yaxshimisiz\n\nMenga ${plan.label} Telegram Premium kerak edi. Uning narxi ${fmt(plan.price)} so'm ekan\n\nTo'lov qilishim uchun karta raqamingizni yubora olasizmi?`;
  const url = `https://t.me/the_sh0h?text=${encodeURIComponent(text)}`;

  await ctx.reply(
    `💎 ${plan.label} Premium sotib olish uchun quyidagi tugmani bosib, adminga yozing:`,
    Markup.inlineKeyboard([[Markup.button.url("👤 Adminga yozish", url)]])
  );
});

// ================= PUBG UC =================

bot.action(/^pubg_(.+)$/, async (ctx) => {
  const plan = pubgPlans.find((p) => p.id === ctx.match[1]);
  await ctx.answerCbQuery();
  if (!plan) return;
  setState(ctx.from.id, "pubg_id", { plan });
  await ctx.reply(`🎮 ${plan.label} tanlandi.\n\nPUBG Mobile ID raqamingizni yuboring:`, backKeyboard());
});

// ================= GIFT =================

bot.action(/^gift_(.+)$/, async (ctx) => {
  const gift = giftCatalog.find((g) => g.id === ctx.match[1]);
  await ctx.answerCbQuery();
  if (!gift) return;
  setState(ctx.from.id, "gift_recipient", { gift });
  await ctx.reply(
    `${gift.label} tanlandi.\n\nGiftni kimga yubormoqchisiz? Telegram username kiriting (masalan: @username):`,
    backKeyboard()
  );
});

// ================= REFERAL =================

bot.action("referral_info", async (ctx) => {
  await ctx.answerCbQuery();
  const user = ensureUser(ctx);
  const invited = countReferrals(user.id);
  const link = config.botUsername
    ? `https://t.me/${config.botUsername}?start=ref_${user.id}`
    : `(.env fayliga BOT_USERNAME kiritilmagan)`;
  await ctx.reply(
    `👥 REFERAL TIZIMI\n\n` +
      `🎁 Botga do'stingizni taklif qiling. Do'stingiz botdan buyurtma qilsa, siz bonus olasiz.\n\n` +
      `⭐ Telegram Stars: +1% bonus\n` +
      `💎 Telegram Premium: +5⭐ bonus\n\n` +
      `👤 Taklif qilgan do'stlaringiz: ${invited} ta\n\n` +
      `🔗 Havolangiz:\n${link}`,
    profileKeyboard()
  );
});

// ================= STARS YECHISH (withdraw) =================

bot.action("stars_withdraw_start", async (ctx) => {
  await ctx.answerCbQuery();
  const user = ensureUser(ctx);
  setState(ctx.from.id, "withdraw_amount");
  await ctx.reply(
    `🔄 Stars yechish\n\nMavjud Stars balansingiz: ${user.starsBalance} ta\n\nYechmoqchi bo'lgan miqdorni kiriting:`,
    backKeyboard()
  );
});

// ================= HISOBNI TO'LDIRISH (topup) =================

bot.action("topup_start", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(`💰 Hisobni to'ldirish\n\nTo'lov usulini tanlang:`, topupMethodKeyboard());
});

bot.action("topup_auto", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `🚧 Avtomatik to'lov hozircha ishlab chiqilmoqda.\n\nIltimos, hozircha "Karta orqali (qo'lda)" usulidan foydalaning.`,
    topupMethodKeyboard()
  );
});

bot.action("topup_manual", async (ctx) => {
  setState(ctx.from.id, "topup_amount");
  await ctx.answerCbQuery();
  await ctx.reply(`💳 Hisobni to'ldirish (qo'lda)\n\nQancha miqdorda to'ldirmoqchisiz?\nSo'm miqdorini kiriting:`, backKeyboard());
});

bot.action(/^topup_paid_(.+)$/, async (ctx) => {
  const topupId = ctx.match[1];
  const topup = getTopup(topupId);
  await ctx.answerCbQuery();
  if (!topup || topup.status !== "pending") return;
  setState(ctx.from.id, "topup_receipt", { topupId });
  await ctx.reply(`🧾 To'lov skrinshotini yuboring\n\n📸 To'lov qilganingizni rasmini yuboring.`, backKeyboard());
});

bot.action(/^topup_cancel_(.+)$/, async (ctx) => {
  const topupId = ctx.match[1];
  const topup = getTopup(topupId);
  await ctx.answerCbQuery();
  if (!topup || topup.status !== "pending") return;
  setTopupStatus(topupId, "cancelled");
  clearState(ctx.from.id);
  await ctx.reply(`❌ To'lov bekor qilindi.`, mainMenuKeyboard());
});

// ================= ADMIN: TO'LOVNI TASDIQLASH / RAD ETISH =================

bot.action(/^admin_topup_ok_(.+)$/, async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery("Ruxsat yo'q.");
  const topupId = ctx.match[1];
  const topup = getTopup(topupId);
  if (!topup || topup.status !== "pending") return ctx.answerCbQuery("Allaqachon ko'rib chiqilgan.");
  setTopupStatus(topupId, "approved");
  addBalance(topup.userId, topup.amount);
  await ctx.answerCbQuery("✅ Tasdiqlandi.");
  await ctx.editMessageReplyMarkup(undefined).catch(() => {});
  await bot.telegram
    .sendMessage(topup.userId, `✅ To'lovingiz tasdiqlandi!\n\n+${fmt(topup.amount)} so'm hisobingizga qo'shildi.`)
    .catch(() => {});
});

bot.action(/^admin_topup_no_(.+)$/, async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery("Ruxsat yo'q.");
  const topupId = ctx.match[1];
  const topup = getTopup(topupId);
  if (!topup || topup.status !== "pending") return ctx.answerCbQuery("Allaqachon ko'rib chiqilgan.");
  setTopupStatus(topupId, "rejected");
  await ctx.answerCbQuery("❌ Rad etildi.");
  await ctx.editMessageReplyMarkup(undefined).catch(() => {});
  await bot.telegram
    .sendMessage(topup.userId, `❌ To'lovingiz rad etildi.\n\nSkrinshot noto'g'ri yoki soxta bo'lishi mumkin. Savol bo'lsa, admin bilan bog'laning.`)
    .catch(() => {});
});

// ================= ADMIN: BUYURTMANI BAJARISH / BEKOR QILISH =================

bot.action(/^admin_order_done_(.+)$/, async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery("Ruxsat yo'q.");
  const orderId = ctx.match[1];
  const order = getOrder(orderId);
  if (!order || order.status !== "pending") return ctx.answerCbQuery("Allaqachon yopilgan.");
  setOrderStatus(orderId, "done");
  await ctx.answerCbQuery("✅ Bajarildi deb belgilandi.");
  await ctx.editMessageReplyMarkup(undefined).catch(() => {});
  await bot.telegram.sendMessage(order.userId, `✅ Buyurtmangiz (#${orderId}) bajarildi. Rahmat!`).catch(() => {});
});

bot.action(/^admin_order_cancel_(.+)$/, async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery("Ruxsat yo'q.");
  const orderId = ctx.match[1];
  const order = getOrder(orderId);
  if (!order || order.status !== "pending") return ctx.answerCbQuery("Allaqachon yopilgan.");
  setOrderStatus(orderId, "cancelled");
  const user = getUser(order.userId);
  if (user && order.price > 0) {
    updateUser(order.userId, {
      balance: user.balance + order.price,
      totalSpent: Math.max(0, user.totalSpent - order.price),
      totalOrders: Math.max(0, user.totalOrders - 1),
    });
  } else if (user && order.type === "starswithdraw") {
    updateUser(order.userId, { starsBalance: user.starsBalance + (order.extra.amount || 0) });
  }
  await ctx.answerCbQuery("❌ Bekor qilindi, mablag' qaytarildi.");
  await ctx.editMessageReplyMarkup(undefined).catch(() => {});
  await bot.telegram
    .sendMessage(order.userId, `❌ Buyurtmangiz (#${orderId}) bekor qilindi. Mablag'ingiz hisobingizga qaytarildi.`)
    .catch(() => {});
});

// ================= ADMIN PANEL: TUGMALAR =================

bot.action("adm_setbalance", async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery("Ruxsat yo'q.");
  await ctx.answerCbQuery();
  setState(ctx.from.id, "admin_setbalance_target");
  await ctx.reply("👤 Balansini o'zgartirmoqchi bo'lgan foydalanuvchi ID yoki @username'ini yuboring:", backKeyboard());
});

bot.action("adm_zerobalance", async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery("Ruxsat yo'q.");
  await ctx.answerCbQuery();
  setState(ctx.from.id, "admin_zero_target");
  await ctx.reply("👤 Balansini 0 qilmoqchi bo'lgan foydalanuvchi ID yoki @username'ini yuboring:", backKeyboard());
});

bot.action("adm_block", async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery("Ruxsat yo'q.");
  await ctx.answerCbQuery();
  setState(ctx.from.id, "admin_block_target");
  await ctx.reply("🚫 Bloklamoqchi bo'lgan foydalanuvchi ID yoki @username'ini yuboring:", backKeyboard());
});

bot.action("adm_unblock", async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery("Ruxsat yo'q.");
  await ctx.answerCbQuery();
  setState(ctx.from.id, "admin_unblock_target");
  await ctx.reply("✅ Blokdan chiqarmoqchi bo'lgan foydalanuvchi ID yoki @username'ini yuboring:", backKeyboard());
});

bot.action("adm_maintenance_toggle", async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery("Ruxsat yo'q.");
  const settings = getSettings();
  const newMode = !settings.maintenanceMode;
  setMaintenanceMode(newMode);
  await ctx.answerCbQuery(newMode ? "🛠 Texnik ishlar rejimi YONDIRILDI." : "✅ Texnik ishlar rejimi O'CHIRILDI.");
  await ctx.editMessageText("🛠 ADMIN PANEL", adminPanelKeyboard(newMode)).catch(() => {});

  const text = newMode
    ? "🛠 Hozirda admin panelida texnik ishlar olib borilmoqda.\n\nIltimos, birozdan so'ng qayta urinib ko'ring."
    : "✅ Texnik ishlar tugadi, bot yana ishlamoqda!";
  for (const u of getAllUsers()) {
    if (isAdmin(u.id)) continue;
    await ctx.telegram.sendMessage(u.id, text).catch(() => {});
  }
});

bot.action("adm_broadcast", async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery("Ruxsat yo'q.");
  await ctx.answerCbQuery();
  setState(ctx.from.id, "admin_broadcast_text");
  await ctx.reply("📢 Barcha foydalanuvchilarga yubormoqchi bo'lgan xabar matnini kiriting:", backKeyboard());
});

bot.action("adm_stats", async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery("Ruxsat yo'q.");
  await ctx.answerCbQuery();
  const stats = getStats();
  await ctx.reply(
    `📊 STATISTIKA\n\n` +
      `👤 Jami foydalanuvchilar: ${stats.totalUsers} ta\n` +
      `🚫 Bloklangan: ${stats.blockedUsers} ta\n` +
      `🧾 Jami buyurtmalar: ${stats.totalOrders} ta\n` +
      `💰 Jami tushum: ${fmt(stats.totalRevenue)} so'm`
  );
});

// ================= MATNLI XABARLAR (holat mashinasi orqali) =================

bot.on("text", async (ctx) => {
  const userId = ctx.from.id;
  const st = getState(userId);
  const text = ctx.message.text.trim();
  if (!st) return; // kutilayotgan qadam yo'q -- e'tiborsiz qoldiramiz

  if (st.step === "stars_custom") {
    const amount = parseInt(text, 10);
    clearState(userId);
    return finalizeStarsPurchase(ctx, amount);
  }

  if (st.step === "pubg_id") {
    const { plan } = st.data;
    clearState(userId);
    return tryPurchase(ctx, {
      type: "pubguc",
      price: plan.price,
      detailsText: `🎮 ${plan.label} — Player ID: ${text}`,
      extra: { planId: plan.id, playerId: text },
    });
  }

  if (st.step === "gift_recipient") {
    const { gift } = st.data;
    clearState(userId);
    return tryPurchase(ctx, {
      type: "gift",
      price: gift.price,
      detailsText: `${gift.label} — Qabul qiluvchi: ${text}`,
      extra: { giftId: gift.id, recipient: text },
    });
  }

  if (st.step === "channelpost_link") {
    setState(userId, "channelpost_amount", { link: text });
    return ctx.reply(`⭐ Nechta Stars yubormoqchisiz? Miqdorni kiriting:`, backKeyboard());
  }

  if (st.step === "channelpost_amount") {
    const amount = parseInt(text, 10);
    if (!Number.isFinite(amount) || amount <= 0) return ctx.reply(`❌ Iltimos, to'g'ri miqdor kiriting.`);
    const { link } = st.data;
    clearState(userId);
    const price = starsPrice(amount);
    return tryPurchase(ctx, {
      type: "channelpost",
      price,
      detailsText: `📢 Kanal postiga ${amount} ⭐ Stars\nPost: ${link}`,
      extra: { link, amount },
    });
  }

  if (st.step === "topup_amount") {
    const amount = parseInt(text, 10);
    if (!Number.isFinite(amount) || amount <= 0) return ctx.reply(`❌ Iltimos, to'g'ri miqdor kiriting.`);
    clearState(userId);
    const topup = createTopup({ userId, amount });
    return ctx.reply(
      `🧾 To'lov ma'lumotlari\n\n` +
        `Summa: ${fmt(amount)} so'm\n\n` +
        `💳 Karta raqami:\n${config.card.number}\n\n` +
        `👤 Karta egasi: ${config.card.owner}\n\n` +
        `To'lov qilgandan so'ng, "To'lov qildim" tugmasini bosing va skrinshot yuboring.`,
      paidOrCancelKeyboard(topup.id)
    );
  }

  if (st.step === "withdraw_amount") {
    const amount = parseInt(text, 10);
    if (!Number.isFinite(amount) || amount <= 0) return ctx.reply(`❌ Iltimos, to'g'ri miqdor kiriting.`);
    const user = getUser(userId);
    if (user.starsBalance < amount) {
      clearState(userId);
      return ctx.reply(
        `❌ Stars balansingiz yetarli emas!\n\nBalans: ${user.starsBalance} ta\nKerak: ${amount} ta`,
        mainMenuKeyboard()
      );
    }
    setState(userId, "withdraw_recipient", { amount });
    return ctx.reply(`👤 Kimga yuborilsin?\nTelegram username kiriting (@username) yoki "O'zimga" tugmasini bosing:`, withdrawRecipientKeyboard());
  }

  if (st.step === "withdraw_recipient") {
    const { amount } = st.data;
    const recipient = text === "👤 O'zimga" ? (ctx.from.username ? `@${ctx.from.username}` : String(userId)) : text;
    clearState(userId);
    const user = getUser(userId);
    if (user.starsBalance < amount) {
      return ctx.reply(`❌ Stars balansingiz yetarli emas! Balans: ${user.starsBalance} ta`, mainMenuKeyboard());
    }
    updateUser(userId, { starsBalance: user.starsBalance - amount });
    const order = createOrder({
      userId,
      type: "starswithdraw",
      price: 0,
      detailsText: `🔄 ${amount} ⭐ Stars yechish — Qabul qiluvchi: ${recipient}`,
      extra: { amount, recipient },
    });
    await ctx.reply(`✅ So'rov qabul qilindi!\n\n${amount} ⭐ Stars "${recipient}"ga yuboriladi.\nSo'rov raqami: ${order.id}`, mainMenuKeyboard());
    for (const adminId of config.adminIds) {
      await bot.telegram
        .sendMessage(
          adminId,
          `🔄 Stars yechish so'rovi!\n\nFoydalanuvchi: ${user.firstName} (ID: ${user.id})\nMiqdor: ${amount} ⭐\nQabul qiluvchi: ${recipient}\nSo'rov ID: ${order.id}`,
          adminOrderKeyboard(order.id)
        )
        .catch(() => {});
    }
    return;
  }

  // ---- ADMIN PANEL: matnli qadamlar ----

  if (st.step === "admin_setbalance_target") {
    const target = resolveUserQuery(text);
    if (!target) {
      clearState(userId);
      return ctx.reply("❌ Bunday foydalanuvchi topilmadi. ID yoki @username to'g'ri ekanini tekshiring.");
    }
    setState(userId, "admin_setbalance_amount", { targetId: target.id });
    return ctx.reply(
      `👤 ${target.firstName} (ID: ${target.id})\nJoriy balans: ${fmt(target.balance)} so'm\n\nYangi balans miqdorini kiriting (so'm):`
    );
  }

  if (st.step === "admin_setbalance_amount") {
    const amount = parseInt(text, 10);
    if (!Number.isFinite(amount) || amount < 0) return ctx.reply("❌ To'g'ri son kiriting (0 yoki undan katta).");
    const { targetId } = st.data;
    clearState(userId);
    setBalance(targetId, amount);
    await ctx.reply(`✅ Balans o'zgartirildi!\nYangi balans: ${fmt(amount)} so'm`, adminPanelKeyboard(getSettings().maintenanceMode));
    await bot.telegram
      .sendMessage(targetId, `ℹ️ Balansingiz administrator tomonidan o'zgartirildi.\n\nYangi balans: ${fmt(amount)} so'm`)
      .catch(() => {});
    return;
  }

  if (st.step === "admin_zero_target") {
    const target = resolveUserQuery(text);
    clearState(userId);
    if (!target) return ctx.reply("❌ Bunday foydalanuvchi topilmadi.");
    setBalance(target.id, 0);
    await ctx.reply(`✅ ${target.firstName} (ID: ${target.id}) balansi 0 ga tushirildi.`, adminPanelKeyboard(getSettings().maintenanceMode));
    await bot.telegram.sendMessage(target.id, "ℹ️ Balansingiz administrator tomonidan 0 ga tushirildi.").catch(() => {});
    return;
  }

  if (st.step === "admin_block_target") {
    const target = resolveUserQuery(text);
    clearState(userId);
    if (!target) return ctx.reply("❌ Bunday foydalanuvchi topilmadi.");
    if (isAdmin(target.id)) return ctx.reply("❌ Adminni bloklab bo'lmaydi.");
    blockUser(target.id);
    await ctx.reply(`🚫 ${target.firstName} (ID: ${target.id}) bloklandi.`, adminPanelKeyboard(getSettings().maintenanceMode));
    await bot.telegram.sendMessage(target.id, "🚫 Siz botdan foydalanish huquqidan mahrum qilindingiz.").catch(() => {});
    return;
  }

  if (st.step === "admin_unblock_target") {
    const target = resolveUserQuery(text);
    clearState(userId);
    if (!target) return ctx.reply("❌ Bunday foydalanuvchi topilmadi.");
    unblockUser(target.id);
    await ctx.reply(`✅ ${target.firstName} (ID: ${target.id}) blokdan chiqarildi.`, adminPanelKeyboard(getSettings().maintenanceMode));
    await bot.telegram.sendMessage(target.id, "✅ Sizning blokingiz bekor qilindi, botdan foydalanishingiz mumkin.").catch(() => {});
    return;
  }

  if (st.step === "admin_broadcast_text") {
    clearState(userId);
    const allUsers = getAllUsers();
    let sent = 0;
    for (const u of allUsers) {
      const ok = await bot.telegram
        .sendMessage(u.id, text)
        .then(() => true)
        .catch(() => false);
      if (ok) sent++;
    }
    await ctx.reply(`✅ Xabar ${sent}/${allUsers.length} foydalanuvchiga yuborildi.`, adminPanelKeyboard(getSettings().maintenanceMode));
    return;
  }
});

// ================= RASM (to'lov skrinshoti) =================

bot.on("photo", async (ctx) => {
  const userId = ctx.from.id;
  const st = getState(userId);
  if (!st || st.step !== "topup_receipt") return;
  const { topupId } = st.data;
  const topup = getTopup(topupId);
  if (!topup || topup.status !== "pending") return;
  clearState(userId);
  const photo = ctx.message.photo[ctx.message.photo.length - 1];
  const user = getUser(userId);
  await ctx.reply(`✅ Skrinshot qabul qilindi. Admin tomonidan tasdiqlanishini kuting.`, mainMenuKeyboard());
  for (const adminId of config.adminIds) {
    await bot.telegram
      .sendPhoto(adminId, photo.file_id, {
        caption:
          `💳 Yangi to'lov so'rovi!\n\n` +
          `Foydalanuvchi: ${user.firstName} (@${user.username || "yo'q"}, ID: ${user.id})\n` +
          `Summa: ${fmt(topup.amount)} so'm\n` +
          `So'rov ID: ${topup.id}`,
        ...adminTopupKeyboard(topup.id),
      })
      .catch(() => {});
  }
});

// ================= XATOLIKLARNI USHLASH =================

bot.catch((err, ctx) => {
  console.error(`Xatolik yuz berdi (${ctx.updateType}):`, err);
});

// ================= ISHGA TUSHIRISH =================

bot.launch().then(() => {
  console.log("✅ Bot ishga tushdi!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
