const cmd = 'diagnose';
const gear = require("../../gearbox.js");

const init = function (message,userDB,DB) {

let bot = message.botUser


  try{
    

  message.reply(`
LOGCHAN: <#${DB.get(message.guild.id).modules.LOGCHANNEL}>
ADV: <#${DB.get(message.guild.id).modules.ADVLOG}>
ACT: <#${DB.get(message.guild.id).modules.ACTLOG}>
MOD: <#${DB.get(message.guild.id).modules.MODLOG}>

LOGS:: \`\`\`js
${require('util').inspect(DB.get(message.guild.id).logs)}\`\`\`

`)

  }catch(e){
    message.reply(require("util").inspect(e))
    console.log(e)
  }

}
 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'misc'
};
