const gear = require('../core/gearbox.js'),
  DB = gear.serverDB,
  channelDB = gear.channelDB,
  userDB = gear.userDB,
  async = require('async');

module.exports = {
  run: async function run(bot,channel) {
    if (!channel.guild)return;
    var Server = channel.guild

    Server.dDATA = await gear.serverDB.findOne({id: Server.id});
    gear.channelDB.new(channel)

    if (Server.dDATA) {
      if (Server.dDATA.logging) {

        delete require.cache[require.resolve('../core/modules/dev/logs_infra.js')]
        let log = require('../core/modules/dev/logs_infra.js')

        log.init({
          bot,
          server: Server,
          channel: channel,
          logtype: "newChan"
        })

      }
    }
  }
}
