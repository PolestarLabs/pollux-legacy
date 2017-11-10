const gear = require("../../gearbox.js");
const fs = require("fs");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'help';

const init = function (message, userDB, DB) {

  const P={
      lngs: message.lang,
      prefix: message.prefix
    };


let helpkey = mm("helpkey", P)
if (message.content.split(/ +/)[1] == helpkey || message.content.split(/ +/)[1] == "?" || message.content.split(/ +/)[1] == "help") {
let embed = new gear.Discord.RichEmbed
emb.setDescription(mm('usage.askingHelpForHelp',P))
return message.channel.send({embed});
};

  let txt3 = `
**COMMAND LIST:** http://www.pollux.fun/commands

${mm('help.disableNuisance', P)}

${mm('help.invite', P )}: http://goo.gl/qkGqqU

${mm('help.joinSupp', P)}: https://discord.gg/ay48h7Q
`;

  message.author.send(txt3.replace(/\$\{message\.prefix\}/g, message.prefix)).catch(e => {'Fail Silently'})

  console.log("HELP INVOKED")

  let helpol    = mm('help.polHelp',  P),
      heldesc   = mm('help.helpText', P),
      supserv   = mm('help.supserv',  P),
      commlist  = mm('help.commlist', P),
      inviteme  = mm('help.inviteme', P),
      useful    = mm('help.useful',   P);

  let commlink = "http://www.pollux.fun/commands";
  let suplink = "https://discord.gg/ay48h7Q";
  let invitelink = "http://goo.gl/qkGqqU";

  const embed = new gear.Discord.RichEmbed();

  embed.setTitle(helpol)
  embed.setColor("#eb4190")
  embed.setDescription(heldesc)
  embed.setThumbnail(message.botUser.user.avatarURL)
  embed.addField(":sos: " + supserv, suplink, false)
  embed.addField(":hash: " + commlist, commlink, false)
  embed.addField(":heart_decoration: " + inviteme, invitelink, false)
  embed.setFooter(useful + " +stats | +serverinfo | +logs | pollux+nuke | +invite")

  setTimeout(t => message.reply({embed}), 1000)
};

module.exports = {
  pub: true,
  cmd: cmd,
  perms: 8,
  init: init,
  cat: 'help'
};
