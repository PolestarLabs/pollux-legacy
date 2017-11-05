const gear = require("../../gearbox.js");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'personalTxt';

const init = async function (message, userDB, DB) {
  const Channel = message.channel;
  const Author = message.author;
  const MSG = message.content;
  const LANG = message.lang;
  const userData = Author.dDATA
  const persotxt = MSG.split(/ +/).slice(1).join(' ');

  //HELP TRIGGER
    let P={lngs:message.lang,}
    if(gear.autoHelper([mm("helpkey",P)],{cmd,message,opt:this.cat}))return;
  //------------

  await gear.userDB.set(Author.id, {$set:{'modules.persotext':persotxt}});
  userData.persotext = persotxt
  message.reply(mm('profile.persotexUpdate', {
    lngs: LANG,
    pstext: persotxt,
    prefix: message.prefix,
    interpolation: {'escapeValue': false}
  }))
}

module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'social'
};
