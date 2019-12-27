const gear = require('../core/gearbox.js');
const log = require('../core/modules/dev/logs_infra.js')

exports.run = async function run(bot, msg_old, msg_new) {
 
  if (!msg_new.guild) return;
  gear.serverDB.findOne({
    id: msg_new.guild.id 
  },{"modules.LOCALRANKx":0}).lean().exec().then(async ddata => {

     
  //  if (!msg_new.author.bot) gear.channelDB.set(msg_new.channel.id, {$set: {snipe: {msg_old,msg_new}}}).then(x => "ok");

    if (msg_old.author.id == bot.user.id) return;
    if (msg_old.author.bot) return;
    if (ddata) {
      if (
        msg_new.content.startsWith(ddata.modules.PREFIX) ||
        msg_new.content.startsWith("px!") ||
        msg_new.content.startsWith("plx!")
      ) {
        try {
          let mess = require("./message.js");
          mess.run(bot, msg_new);
          return;
        } catch (e) {
          // Fail Silently
        }
      }

      if (!ddata.logging) return ddata = null;
      if (msg_old.content == msg_new.content) return;
      //delete require.cache[require.resolve('../core/modules/dev/logs_infra.js')]
      //const log = require('../core/modules/dev/logs_infra.js')
      log.init({
        bot,
        server: msg_new.guild,
        message: msg_new,
        message_old: msg_old,
        message_new: msg_new,
        member: msg_new.member,
        user: msg_new.author,
        logtype: "messEdit"
      })
    }
  });
}