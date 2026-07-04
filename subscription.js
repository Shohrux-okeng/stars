const config = require("./config");

async function isSubscribedAll(bot, userId) {
  if (config.requiredChannels.length === 0) return true;
  for (const channel of config.requiredChannels) {
    try {
      const member = await bot.telegram.getChatMember(channel, userId);
      if (["left", "kicked"].includes(member.status)) {
        return false;
      }
    } catch (err) {
      // Bu yerga botning kanalda ADMIN emasligi yoki kanal noto'g'ri kiritilgani
      // sababli ham tushish mumkin. Log'da xatolikni ko'ring.
      console.error(`Kanal tekshirishda xatolik (${channel}):`, err.description || err.message);
      return false;
    }
  }
  return true;
}

module.exports = { isSubscribedAll };
