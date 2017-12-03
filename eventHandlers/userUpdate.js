const gear = require('../core/gearbox.js'),
  DB = gear.serverDB,
  channelDB = gear.channelDB,
  userDB = gear.userDB,
  async = require('async');

module.exports = {
  run: async function run(bot, oldUser, newUser) {

    bot.guilds.forEach(async Server => {
      if (Server.members.has(newUser.id)) {

        Server.dDATA = await gear.serverDB.findOne({
          id: Server.id
        });


        if (Server.dDATA) {

          if (Server.dDATA.logging == true) {

            delete require.cache[require.resolve('../core/modules/dev/logs_infra.js')]
            let log = require('../core/modules/dev/logs_infra.js')


            const av_A = oldUser.avatarURL;
            const av_B = newUser.avatarURL;
            if (av_A != av_B) {

              log.init({
                bot,
                server: Server,
                old: Server.member(oldUser),
                new: Server.member(newUser),
                user: newUser,
                logtype: "usrPhoto",
                av_A,
                av_B
              })
            }
          }
        }
      }
    })
  }
}
