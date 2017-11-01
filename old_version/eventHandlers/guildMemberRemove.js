
const polx = require("../pollux.js")
const fs = require("fs")
var defaults = require("../utils/defaults.js") // Database Defaults


module.exports = {
    run: async function run(gear, DB, userDB, bot, member) {
      
        const Server = member.guild
        Server.dDATA =  await DB.findOne({_id:Server.id});
        const locale = Server.dDATA.modules.LANGUAGE || "en";

        gear.sendLog("userLeave","act",member.guild,DB,member.user.username,false,{user: { img:(member.user.avatarURL||member.user.defaultAvatarURL)}})

        if (Server) {
            let defaultgreetB = {
                hi: false,
                joinText: "%username% has left us!",
                greetChan: ""
            }
            if (!Server.dDATA.modules.FWELL || Server.dDATA.modules.FWELL === undefined) {
                gear.paramDefine(Server, "FWELL", defaultgreetB)
            }
            if (Server.dDATA.modules.FWELL.hiDEL === undefined) {
                gear.paramDefine(Server, "FWELL.hiDEL", 5000)
            }

            let delTime = Server.dDATA.modules.FWELL.hiDEL || 5000;

            if (typeof (Server.dDATA.modules.FWELL.hi) !== 'undefined' && Server.dDATA.modules.FWELL.joinText !== '' && Server.dDATA.modules.FWELL.hi == true) {

                let channels = member.guild.channels.filter(c => {
                    return (c.id === Server.dDATA.modules.FWELL.greetChan)
                });
                let channel = channels.first();
                let content = Server.dDATA.modules.FWELL.joinText.replace(/%user%/g, member.user).replace(/%username%/g, member.displayName);
                content = content.replace(/%server%/g, member.guild.name);
                try {
                    channel.send(content).then(m => {
                        if (typeof delTime === "number" && delTime > 0) {
                            m.delete(delTime).catch(e => {
                                console.log(e)
                                console.log("DELTIME FWELL 915".red)
                            })
                        }
                    });
                } catch (e) {console.log(e)}
            }
        }

    }
}
