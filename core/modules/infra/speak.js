const gear = require("../../gearbox.js");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'speak';

const init = function (message,userDB,DB) {

  const Server = message.guild;
  const Channel = message.channel;
  const Member = message.member;
  const MSG = message.content;
  const args = MSG.split(' ').slice(1)[0]
  const scope = MSG.split(' ').slice(1)[1] || "s";

  const P = {lngs:message.lang};

if(gear.autoHelper([mm("helpkey",P)],{cmd,message,opt:'language'}))return;

  const noperms     =   mm('CMD.moderationNeeded',P)
  const noPermsMe   =   mm('CMD.unperm',P)
  if (!gear.hasPerms(Member,DB))return message.reply(noperms).catch();

  delete require.cache[require.resolve('../../../utils/i18n.json')];
  const i18n = require('../../../utils/i18n.json');

  let l = i18n.length;

  for (i=0; i<l;i++){
    let Y = i18n[i];
    let langArray = Y.code;
    langArray.push(Y.name);
    langArray.push(Y['name-e']);
    if (langArray.includes(args)) {
      if(['c','channel','ch'].includes(scope)){
          gear.channelDB.set(Channel.id, {
            $set:{'LANGUAGE':Y.iso}
          }).then(ok => {
            message.reply(Y.flag+" "+mm(`langIntro.channel`,P).replace("English",gear.capitalize(Y['name-e'])));
          }).catch(e => message.reply("Error"));
      }else{
          gear.serverDB.set(Server.id, {
            $set:{'modules.LANGUAGE':Y.iso}
          }).then(ok => {
            message.reply(Y.flag+" "+mm(`langIntro.global`,P).replace("English",gear.capitalize(Y['name-e'])));
          }).catch(e => message.reply("Error"));
      }
    }else{
         if (['delete','reset','del','server'].includes(args)) {
      if(['c','channel','ch'].includes(scope)){
          gear.channelDB.set(Channel.id, {
            $set:{'LANGUAGE':undefined}
          }).then(ok => {
            let localLY = (Server.dDATA.modules.LANGUAGE||'en')
            let globalLang = i18n.find(x=>x.iso==localLY);
            console.log(globalLang)
            message.reply(globalLang.flag+" "+mm(`langIntro.channel`,P));
          }).catch(e => {console.log(e);message.reply("Error")});
          break;
          }
      }
    }
  };

};

module.exports = {pub:true,cmd: cmd, perms: 2, init: init, cat: 'language'};
