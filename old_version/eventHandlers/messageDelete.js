
const polx = require("../pollux.js")
const fx = require("../core/functions.js")


module.exports = {
    run:  function run(gear,DB,userDB,bot, msg) {
          try{
                      if(msg.author.id==bot.user.id)return;
          if(msg.author.bot)return;
 gear.sendLog("messDel","act",msg.guild,DB,msg.channel.name,msg.mentions._content||msg.content,{
           user: {
             men:msg.author.tag,
             img:(msg.author.avatarURL||msg.author.defaultAvatarURL)
           }
         })
          }catch(e){
            console.log(e)
          }
    }
}
