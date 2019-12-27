const gear = require('../core/gearbox.js'),
  DB = gear.serverDB,
  channelDB = gear.channelDB,
  userDB = gear.userDB,
  async = require('async');

module.exports = {
  run: async function run(bot, member) {


 
    

    var Server = member.guild

    let SERVERDATA = await gear.serverDB.findOne({
      id: Server.id
    }).lean().exec();

    if (SERVERDATA) {


      if(Server.id === '277391723322408960'){
        udata = await gear.userDB.findOne({id:member.id}).lean().exec();
        if(udata.blacklisted){
          bot.channels.get('392434351637266434').send(`Behold! blacklisted user <@${member.id}> inbound. Bl'd for \`${udata.blacklisted}\``);
        }
      }

      if (SERVERDATA.logging) {

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

          if (SERVERDATA.modules.AUTOROLES && SERVERDATA.modules.AUTOROLES.length>0) {

            let AUTOS = SERVERDATA.modules.AUTOROLES
            let addinrole = AUTOS.find(rl => Number(rl[1]) == 0);
            
            if (addinrole) {
           
              await member.roles.add([addinrole[0]]);
            }
          }
        } catch (e) {
          console.error(e)
        }

      if (SERVERDATA.modules.GREET.channel && SERVERDATA.modules.GREET.enabled == true) {
        try{


        let delTime = SERVERDATA.modules.GREET.timer;
        delTime = delTime === undefined ? 0 : delTime;

        let channel = member.guild.channels.get(SERVERDATA.modules.GREET.channel);
        let content = SERVERDATA.modules.GREET.text.replace(/%user%/g, member.user).replace(/%username%/g, member.user.username);
        content = content.replace(/%server%/g, member.guild.name);
        try {
          if (SERVERDATA.imgwelcome) {

            let msg = {
              channel,
              author: member.user,
              lang: SERVERDATA.modules.LANGUAGE || ['en', 'dev']
            }

            require('../core/modules/dev/wilk_routine.js').init(msg, member.user, channel)
          };

          channel.send(content).then(m => {
            if (typeof delTime === "number" && delTime > 0) {
              m.delete({timeout:delTime}).catch(e => {
                console.error(e)
                console.log("DELTIME GREET 829".red)
              })
            }
          }).catch(e=>"too bad");
        } catch (e) {
          console.log("Error on Wilk Routine - Guild Member Add")
          console.error(e)
          console.log("Error on Wilk Routine - Guild Member Add")
        }
        }catch(e){
          console.log("General Error on Guild Member Add")

        }

      }




    }
  }
}
