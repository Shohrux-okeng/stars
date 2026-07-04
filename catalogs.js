const config = require("./config");

// ============ Telegram Stars ============
const starsPresetAmounts = [50, 75, 100, 150, 250, 350, 500, 750, 1000, 1500, 2500, 5000, 10000];
const starsMin = 50;
const starsMax = 10000;
function starsPrice(amount) {
  return amount * config.starRateSom;
}

// ============ Telegram Premium ============
// Narxlarni bemalol o'zgartiring (so'm hisobida)
const premiumPlans = [
  { id: "p1", label: "1 oy", price: 40000 },
  { id: "p3", label: "3 oy", price: 160000 },
  { id: "p6", label: "6 oy", price: 220000 },
  { id: "p12", label: "12 oy", price: 390000 },
];

// ============ PUBG Mobile UC ============
// Narxlarni bemalol o'zgartiring (so'm hisobida)
const pubgPlans = [
  { id: "uc60", label: "60 UC", price: 12000 },
  { id: "uc325", label: "325 UC", price: 60000 },
  { id: "uc660", label: "660 UC", price: 115000 },
  { id: "uc1800", label: "1800 UC", price: 300000 },
  { id: "uc3850", label: "3850 UC", price: 620000 },
  { id: "uc8100", label: "8100 UC", price: 1250000 },
];

// ============ Telegram Gift ============
const giftCatalog = [
  { id: "heart", label: "💝 Heart", price: 3000 },
  { id: "bear", label: "🧸 Bear", price: 3000 },
  { id: "giftbox", label: "🎁 Gift Box", price: 5000 },
  { id: "rose", label: "🌹 Rose", price: 5000 },
  { id: "cake", label: "🎂 Cake", price: 10000 },
  { id: "rocket", label: "🚀 Rocket", price: 10000 },
  { id: "ring", label: "💍 Ring", price: 20000 },
  { id: "trophy", label: "🏆 Trophy", price: 20000 },
  { id: "diamond", label: "💎 Diamond", price: 20000 },
];

module.exports = {
  starsPresetAmounts,
  starsMin,
  starsMax,
  starsPrice,
  premiumPlans,
  pubgPlans,
  giftCatalog,
};
