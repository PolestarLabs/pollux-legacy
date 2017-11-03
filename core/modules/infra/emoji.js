const gear = require("../../gearbox.js");
const cmd = 'emoji';
const init = function (message, userDB, DB) {
  let args = message.content.split(' ').slice(1);
  let output = "";
  for (let i = 0; i < args.length; i++) {
    output += gear.emoji(args[i])
  }
  message.channel.send(output)
};
module.exports = {
  cmd: cmd,
  perms: 5,
  init: init,
  cat: 'infra'
};
