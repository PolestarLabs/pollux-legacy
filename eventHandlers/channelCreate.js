
module.exports = {
  run: async function run(bot,channel) {
const gear = require('../core/gearbox.js'),
  DB = gear.serverDB,
  channelDB = gear.channelDB,
  userDB = gear.userDB,
  async = require('async');
    if (!channel.guild)return;
    let Server = channel.guild

    Server.dDATA = await gear.serverDB.findOne({id: Server.id},{'modules.LOCALRANKx':0});
    gear.channelDB.new(channel);

    if (Server.dDATA) {
      if (Server.dDATA.logging) {

        delete require.cache[require.resolve('../core/modules/dev/logs_infra.js')]
        let log = require('../core/modules/dev/logs_infra.js')

        log.init({
          bot,
          server: Server,
          channel: channel,
          logtype: "newChan"
        });
        Server = null;

      }
    }
  }
}
