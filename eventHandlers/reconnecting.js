const gear = require("../core/gearbox.js");

exports.run =async function run(bot) {
  bot.user.setStatus('dnd');
  bot.user.setGame('Reconnecting...');
  bot.destroy();
}
