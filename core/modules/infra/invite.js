const cmd = 'invite';
const gear = require("../../gearbox.js");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const init = function (message,userDB,DB) {

  let a = 'CMD.inviteText'
  let b = {lngs:message.lang}

  let embed = new gear.RichEmbed
  embed.setDescription(":love_letter: "+mm(a,b)+"(http://goo.gl/qkGqqU) !");
  embed.setColor("#ea7d7d")

  message.channel.send({embed})
}
 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 8,
    init: init,
    cat: 'infra'
};
