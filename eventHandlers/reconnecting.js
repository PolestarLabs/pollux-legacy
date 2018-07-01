const gear = require("../core/gearbox.js");

exports.run =async function run(bot) {
  await bot.user.setStatus('dnd');
  await bot.user.setGame('Reconnecting...');
  process.exit(0);
}
