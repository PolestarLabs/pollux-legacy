
const polx = require("../pollux.js")
const fx = require("../core/functions.js")


module.exports = {
    run: async function run(gear, DB, userDB, bot, member) {

      if ((await DB.findOne({_id:member.guild.id})).imgGreet===true) {
        console.log("THOT -----------------------")
        console.log(member.guild.id)

        console.log("THOT PATROL-----------------------")
        let Welchan = member.guild.channels.get((await DB.findOne({_id:member.guild.id})).modules.GREET.greetChan)

        require("../core/modules/dev/wilk_routine.js").init(undefined, userDB, DB, member.user, Welchan)


      }
  const Server = member.guild
        Server.dDATA =  await DB.findOne({_id:Server.id});
        const locale = Server.dDATA.modules.LANGUAGE || "en";
        
        gear.sendLog("userJoin","act",member.guild,DB,member.user.username,false,{user: { img:(member.user.avatarURL||member.user.defaultAvatarURL)}})
      
        if (Server) {
            let defaultgreet = {
                hi: false,
                joinText: "Welcome to the Server %username%!",
                greetChan: ""
            }
            try {
                if (!Server.dDATA.modules.GREET || Server.dDATA.modules.GREET === undefined) {
                    gear.paramDefine(Server, "GREET", defaultgreet)
                }
            } catch (e) {
                fx.run("serverSetup",Server)
            }
            if (typeof (Server.dDATA.modules.GREET.hi) !== 'undefined' && Server.dDATA.modules.GREET.joinText !== '' && Server.dDATA.modules.GREET.hi == true) {
                if (Server.dDATA.modules.GREET.hiDEL === undefined) {
                    gear.paramDefine(Server, "GREET.hiDEL", 5000)
                }
                let delTime = Server.dDATA.modules.GREET.hiDEL || 5000;

                let channel = member.guild.channels.get(Server.dDATA.modules.GREET.greetChan)
                
                let content = Server.dDATA.modules.GREET.joinText.replace(/%user%/g, member.user).replace(/%username%/g, member.displayName);
                content = content.replace(/%server%/g, member.guild.name);
                try {
                    channel.send(content).then(m => {
                        if (delTime == 0)return;
                        if (typeof delTime === "number" && delTime > 0) {
                            m.delete(delTime).catch(e => {
                                console.log(e)
                                console.log("DELTIME GREET 829".red)
                            })
                        }
                    });
                } catch (e) {}
            }
        }
    }
}
