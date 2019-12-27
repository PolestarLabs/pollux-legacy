const gear = require('../core/gearbox.js'),
async = require('async');

module.exports = {
  run: async function run(bot,channel) {

    var Server = channel.guild

    Server.dDATA = await gear.serverDB.findOne({id: Server.id});
    gear.channelDB.remove({id:channel.id});

    if (Server.dDATA) {
      if (Server.dDATA.logging) {

        delete require.cache[require.resolve('../core/modules/dev/logs_infra.js')]
        let log = require('../core/modules/dev/logs_infra.js')

        log.init({
          bot,
          server: Server,
          channel: channel,
          logtype: "delChan"
        })
        Server = null
      }
    }
  }
}
