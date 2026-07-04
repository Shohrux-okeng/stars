const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync(path.join(__dirname, "db.json"));
const db = low(adapter);

db.defaults({ users: [], orders: [], topups: [], settings: { maintenanceMode: false } }).write();

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getUser(id) {
  return db.get("users").find({ id }).value();
}

function getUserByUsername(username) {
  const uname = String(username).replace("@", "").toLowerCase();
  return db
    .get("users")
    .find((u) => (u.username || "").toLowerCase() === uname)
    .value();
}

function getAllUsers() {
  return db.get("users").value() || [];
}

function ensureUser(ctx) {
  const id = ctx.from.id;
  let user = getUser(id);
  if (!user) {
    user = {
      id,
      username: ctx.from.username || null,
      firstName: ctx.from.first_name || "Foydalanuvchi",
      balance: 0,
      starsBalance: 0,
      totalOrders: 0,
      totalSpent: 0,
      referredBy: null,
      blocked: false,
      joinedAt: Date.now(),
    };
    db.get("users").push(user).write();
  }
  return user;
}

function updateUser(id, patch) {
  db.get("users").find({ id }).assign(patch).write();
  return getUser(id);
}

// ---- Balansni boshqarish ----
function setBalance(id, newBalance) {
  return updateUser(id, { balance: newBalance });
}

function addBalance(id, amount) {
  const user = getUser(id);
  if (!user) return null;
  const updatedBalance = (user.balance || 0) + amount;
  return updateUser(id, { balance: updatedBalance });
}

// ---- Bloklash ----
function isBlocked(id) {
  const user = getUser(id);
  return !!(user && user.blocked);
}

function blockUser(id) {
  return updateUser(id, { blocked: true });
}

function unblockUser(id) {
  return updateUser(id, { blocked: false });
}

function setReferrer(userId, referrerId) {
  if (userId === referrerId) return;
  const user = getUser(userId);
  if (!user || user.referredBy) return;
  const referrer = getUser(referrerId);
  if (!referrer) return;
  updateUser(userId, { referredBy: referrerId });
}

function createOrder(order) {
  const full = { id: genId(), status: "pending", createdAt: Date.now(), ...order };
  db.get("orders").push(full).write();
  return full;
}

function getOrder(id) {
  return db.get("orders").find({ id }).value();
}

function setOrderStatus(id, status) {
  db.get("orders").find({ id }).assign({ status }).write();
  return getOrder(id);
}

function createTopup(topup) {
  const full = { id: genId(), status: "pending", createdAt: Date.now(), ...topup };
  db.get("topups").push(full).write();
  return full;
}

function getTopup(id) {
  return db.get("topups").find({ id }).value();
}

function setTopupStatus(id, status) {
  db.get("topups").find({ id }).assign({ status }).write();
  return getTopup(id);
}

function topUsers(limit = 10) {
  return db.get("users").orderBy(["totalSpent"], ["desc"]).take(limit).value();
}

function countReferrals(userId) {
  return db.get("users").filter({ referredBy: userId }).size().value();
}

// ---- Sozlamalar (texnik ishlar rejimi) ----
function getSettings() {
  return db.get("settings").value() || { maintenanceMode: false };
}

function setMaintenanceMode(on) {
  db.get("settings").assign({ maintenanceMode: !!on }).write();
  return getSettings();
}

// ---- Statistika ----
function getStats() {
  const users = getAllUsers();
  const orders = db.get("orders").value() || [];
  return {
    totalUsers: users.length,
    blockedUsers: users.filter((u) => u.blocked).length,
    totalOrders: orders.length,
    totalRevenue: users.reduce((s, u) => s + (u.totalSpent || 0), 0),
  };
}

module.exports = {
  db,
  genId,
  getUser,
  getUserByUsername,
  getAllUsers,
  ensureUser,
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
};
