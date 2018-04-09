const gear = require('../core/gearbox.js'),
  DB = gear.serverDB,
  channelDB = gear.channelDB,
  userDB = gear.userDB,
  async = require('async');

module.exports = {
  run: async function run(bot, member) {

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
          logtype: "userJoin"
        })

      }

        try {

          if (Server.dDATA.modules.AUTOROLES) {

            let AUTOS = Server.dDATA.modules.AUTOROLES
            let addinrole = AUTOS.find(rl => rl[1] == 0);

            if (addinrole) {
              await member.addRole(addinrole[0]);
            }
          }
        } catch (e) {
          console.log(e)
        }

      if (Server.dDATA.modules.GREET.channel && Server.dDATA.modules.GREET.enabled == true) {
        try{


        let delTime = Server.dDATA.modules.GREET.timer;
        delTime = delTime === undefined ? 0 : delTime;
        let channels = member.guild.channels.filter(c => {
          return (c.id === Server.dDATA.modules.GREET.channel)
        });
        let channel = channels.first();
        let content = Server.dDATA.modules.GREET.text.replace(/%user%/g, member.user).replace(/%username%/g, member.user.username);
        content = content.replace(/%server%/g, member.guild.name);
        try {
          if (Server.dDATA.imgwelcome) {

            let msg = {
              channel,
              author: member.user,
              lang: Server.dDATA.modules.LANGUAGE || ['en', 'dev']
            }

            require('../core/modules/dev/wilk_routine.js').init(msg, member.user, channel)
          };

          channel.send(content).then(m => {
            if (typeof delTime === "number" && delTime > 0) {
              m.delete(delTime).catch(e => {
                console.log(e)
                console.log("DELTIME GREET 829".red)
              })
            }
          });
        } catch (e) {
          console.log("Error on Wilk Routine - Guild Member Add")
          console.log(e)
          console.log("Error on Wilk Routine - Guild Member Add")
        }
        }catch(e){
          console.log("General Error on Guild Member Add")

        }

      }




    }
  }
}
