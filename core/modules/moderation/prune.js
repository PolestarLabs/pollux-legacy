const gear = require("../../gearbox.js");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const cmd = 'prune';

const init = function (message, userDB, DB) {


  const Channel = message.channel;
  const Author = message.author;
  const Target = message.mentions.users.first();
  const MSG = message.content;
  const bot = message.botUser
  const args = MSG.split(/ +/).slice(1)[0]
  const targ = MSG.split(/ +/).slice(1)[1]
  const LANG = message.lang;

  //-------MAGIC----------------

  const P = {
    lngs: message.lang
  };
  if (gear.autoHelper([mm("helpkey", P), 'noargs', ''], {
      cmd,
      message,
      opt: this.cat
    })) return;

  const noperms = mm('CMD.moderationNeeded', {
    lngs: LANG
  })
  const noPermsMe = mm('CMD.unperm', {
    lngs: LANG
  })
  const justasec = mm('CMD.jas', {
    lngs: LANG
  })
  const lerror = mm('CMD.genericInvalid', {
    lngs: LANG
  })

  if (!message.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")) {
    return message.reply(
      mm("error.iNeedThesePerms", {
        lngs: LANG,
        PERMSLIST:`:small_orange_diamond: **MANAGE MESSAGES**`
      })

    )
  }


  const modPass = gear.hasPerms(message.member, DB)

  if (!modPass) {
    return message.reply(mm('CMD.moderationNeeded', P)).catch(console.error);
  }

  let TargetId = (Target || {
    id: targ
  } || Author).id

  console.log(TargetId)


    const user = message.mentions.users.first();
    const amount = parseInt(args);
    if (!amount) return message.reply(gear.emoji('nope')+' How many to delete?');
    if (!amount && !TargetId) return message.reply(gear.emoji('nope')+' I need someone and how many messages to delete!');
    message.channel.fetchMessages({ before: message.id ,limit: amount }).then((messages) => {
      if (TargetId) {
        const filterBy = TargetId ? TargetId : bot.user.id;
        messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
      }
      message.channel.bulkDelete(messages).then(m=>message.delete()).catch(error => console.log(error.stack));
    });


};
module.exports = {
  pub: true,
  cmd: cmd,
  perms: 1,
  init: init,
  cat: 'mod'
};
