
const polx = require("../pollux.js")
const fx = require("../core/functions.js")


module.exports = {
    run:  async function run(gear,DB,userDB,bot, msg,msn) {
        
    
          await msn;
          if(msg.author.id==bot.user.id)return;
          if(msg.author.bot)return;
          if(msg.author.bot) return;
          try{
          await gear.sendLog("messEdit","act",msg.guild,DB,msg.channel.name,[msg.content,msn.content],{user:{img:msg.author.avatarURL,name:msg.author.tag}} );
          }catch(e){
            console.log(e)
          }
    
          
           delete require.cache[require.resolve("./message.js")]; 
           let mess = require("./message.js");
            msg.content = msn.content
            await mess.run(gear,DB,userDB,bot, msg);
    }
}
