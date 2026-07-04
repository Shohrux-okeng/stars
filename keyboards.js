const { Markup } = require("telegraf");
const config = require("./config");
const {
  starsPresetAmounts,
  starsPrice,
  premiumPlans,
  pubgPlans,
  giftCatalog,
} = require("./catalogs");
const { fmt } = require("./utils");

function subscribeKeyboard() {
  const rows = config.requiredChannels.map((ch) => [
    Markup.button.url(ch, `https://t.me/${ch.replace("@", "")}`),
  ]);
  rows.push([Markup.button.callback("✅ Tekshirish", "check_sub")]);
  return Markup.inlineKeyboard(rows);
}

function mainMenuKeyboard() {
  return Markup.keyboard([
    ["⭐ Stars olish", "💎 Premium olish"],
    ["🎮 Pubg UC olish", "📢 Kanal postiga Stars"],
    ["🎁 Gift olish", "📊 Top"],
    ["👤 Profil"],
  ]).resize();
}

function backKeyboard() {
  return Markup.keyboard([["⬅️ Orqaga"]]).resize();
}

function withdrawRecipientKeyboard() {
  return Markup.keyboard([["👤 O'zimga"], ["⬅️ Orqaga"]]).resize();
}

function starsAmountKeyboard() {
  const rows = [];
  for (let i = 0; i < starsPresetAmounts.length; i += 2) {
    const chunk = starsPresetAmounts
      .slice(i, i + 2)
      .map((a) => Markup.button.callback(`⭐ ${a} — ${fmt(starsPrice(a))} so'm`, `stars_amt_${a}`));
    rows.push(chunk);
  }
  rows.push([Markup.button.callback("✏️ Boshqa miqdor kiritish", "stars_custom")]);
  rows.push([Markup.button.callback("↩️ Orqaga", "back_menu")]);
  return Markup.inlineKeyboard(rows);
}

function plansKeyboard(plans, prefix) {
  const rows = plans.map((p) => [Markup.button.callback(`${p.label} — ${fmt(p.price)} so'm`, `${prefix}_${p.id}`)]);
  rows.push([Markup.button.callback("↩️ Orqaga", "back_menu")]);
  return Markup.inlineKeyboard(rows);
}

function premiumKeyboard() {
  return plansKeyboard(premiumPlans, "prem");
}

function pubgKeyboard() {
  return plansKeyboard(pubgPlans, "pubg");
}

function giftKeyboard() {
  const rows = [];
  for (let i = 0; i < giftCatalog.length; i += 2) {
    rows.push(
      giftCatalog.slice(i, i + 2).map((g) => Markup.button.callback(`${g.label} | ${fmt(g.price)} so'm`, `gift_${g.id}`))
    );
  }
  rows.push([Markup.button.callback("↩️ Orqaga", "back_menu")]);
  return Markup.inlineKeyboard(rows);
}

function topupMethodKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("💳 Karta orqali (qo'lda)", "topup_manual")],
    [Markup.button.callback("💳 Karta orqali (avto)", "topup_auto")],
    [Markup.button.callback("↩️ Orqaga", "back_profile")],
  ]);
}

function paidOrCancelKeyboard(topupId) {
  return Markup.inlineKeyboard([
    [Markup.button.callback("✅ To'lov qildim", `topup_paid_${topupId}`)],
    [Markup.button.callback("❌ Bekor qilish", `topup_cancel_${topupId}`)],
  ]);
}

function adminTopupKeyboard(topupId) {
  return Markup.inlineKeyboard([
    [Markup.button.callback("✅ Tasdiqlash", `admin_topup_ok_${topupId}`)],
    [Markup.button.callback("❌ Rad etish", `admin_topup_no_${topupId}`)],
  ]);
}

function adminOrderKeyboard(orderId) {
  return Markup.inlineKeyboard([
    [Markup.button.callback("✅ Bajarildi", `admin_order_done_${orderId}`)],
    [Markup.button.callback("❌ Bekor qilish", `admin_order_cancel_${orderId}`)],
  ]);
}

function profileKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("➕ Hisobni to'ldirish", "topup_start")],
    [Markup.button.callback("🔗 Taklif qilish", "referral_info")],
    [Markup.button.callback("🔄 Stars yechish", "stars_withdraw_start")],
    [Markup.button.callback("↩️ Orqaga", "back_menu")],
  ]);
}

function adminPanelKeyboard(maintenanceOn) {
  return Markup.inlineKeyboard([
    [Markup.button.callback("💰 Balansni o'zgartirish", "adm_setbalance")],
    [Markup.button.callback("🧹 Balansni 0 qilish", "adm_zerobalance")],
    [
      Markup.button.callback("🚫 Bloklash", "adm_block"),
      Markup.button.callback("✅ Blokdan chiqarish", "adm_unblock"),
    ],
    [
      Markup.button.callback(
        maintenanceOn ? "🛠 Texnik ishlar: YONIQ (o'chirish)" : "🛠 Texnik ishlar: O'CHIQ (yoqish)",
        "adm_maintenance_toggle"
      ),
    ],
    [Markup.button.callback("📢 Xabar yuborish (hammaga)", "adm_broadcast")],
    [Markup.button.callback("📊 Statistika", "adm_stats")],
  ]);
}

module.exports = {
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
};
