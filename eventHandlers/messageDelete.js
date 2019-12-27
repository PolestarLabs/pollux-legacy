const {serverDB} = require('../core/gearbox.js');
let log = require('../core/modules/dev/logs_infra.js')

exports.run = async function run(bot, msg) {

  if (!msg.guild) return;

  serverDB.findOne({
    id: msg.guild.id
  },{"modules.LOCALRANKx":0}).lean().exec().then(ddata => {

    if (msg.author.bot) return;
    //gear.channelDB.set(msg.channel.id, {$set: {snipe: msg}}).then(x => "k"); 
    if (ddata) {if (msg.content.startsWith(ddata.modules.PREFIX) ||
        msg.content.startsWith("px!") ||
        msg.content.startsWith("plx!")
      ) {
        return;
      }

      if (!ddata.logging) return;
      //delete require.cache[require.resolve('../core/modules/dev/logs_infra.js')]
      log.init({
        bot,
        channel: msg.channel,
        server: msg.guild,
        message: msg,
        member: msg.member,
        user: msg.author,
        logtype: "messDel"
      })

    }
  });
}