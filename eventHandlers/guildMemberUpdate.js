const gear = require('../core/gearbox.js'),
  DB = gear.serverDB,
  channelDB = gear.channelDB,
  userDB = gear.userDB,
  async = require('async');

module.exports = {
  run: async function run(bot, oldMember,newMember) {
    var Server = oldMember.guild

    Server.dDATA = await gear.serverDB.findOne({
      id: Server.id
    });

    if (Server.dDATA) {

      if (oldMember.guild.dDATA.logging) {


        delete require.cache[require.resolve('../core/modules/dev/logs_infra.js')]
        let log = require('../core/modules/dev/logs_infra.js')


        if(oldMember.displayName != newMember.displayName){

        log.init({
          bot,
          server: newMember.guild,
          old: oldMember,
          new: newMember,
          user: newMember.user,
          logtype: "usrNick"
        })
        }

      }
    }
  }
}
