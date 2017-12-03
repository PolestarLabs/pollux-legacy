const gear = require('../core/gearbox.js'),
  DB = gear.serverDB,
  channelDB = gear.channelDB,
  userDB = gear.userDB,
  async = require('async');

module.exports = {
  run: async function run(bot, member) {
    console.log("Member Remove")
    var Server = member.guild

    Server.dDATA = await gear.serverDB.findOne({
      id: Server.id
    });

    if (Server.dDATA) {


      if (member.guild.dDATA.logging) {

        delete require.cache[require.resolve('../core/modules/dev/logs_infra.js')]
        let log = require('../core/modules/dev/logs_infra.js')
        log.init({
          bot,
          server: member.guild,
          member: member,
          user: member.user,
          logtype: "userLeave"
        })

      }


      console.log("Server.dDATA.modules.FWELL.channel: ", Server.dDATA.modules.FWELL.channel)
      console.log("Server.dDATA.modules.FWELL.enabled: ", Server.dDATA.modules.FWELL.enabled)

      if (Server.dDATA.modules.FWELL.channel && Server.dDATA.modules.FWELL.enabled == true) {

        console.log("Member Remove 23")
        let delTime = Server.dDATA.modules.FWELL.timer;
        delTime = delTime === undefined ? 0 : delTime;
        let channels = member.guild.channels.filter(c => {
          return (c.id === Server.dDATA.modules.FWELL.channel)
        });
        let channel = channels.first();
        let content = Server.dDATA.modules.FWELL.text.replace(/%user%/g, member.user).replace(/%username%/g, member.user.username);
        content = content.replace(/%server%/g, member.guild.name);
        try {

          channel.send(content).then(m => {
            if (typeof delTime === "number" && delTime > 0) {
              m.delete(delTime).catch(e => {
                console.log(e)
                console.log("DELTIME FWELL 829".red)
              })
            }
          });
        } catch (e) {}

      }
    }
  }
}
