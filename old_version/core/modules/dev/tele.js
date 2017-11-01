const cmd = 'tele';
const gear = require("../../gearbox.js");

const init = function (message,userDB,DB) {

let bot = message.botUser
let  svid = message.content.split(/ +/)[1]
let  mess = message.content.substr(message.content.indexOf(svid)+svid.length)
  
if (svid == "-df"){
  DB.get(message.guild.id).TELECHAN = message.channel.id
  return message.channel.send("Canal definido")
}

let sv = bot.guilds.get(svid)
dest = sv.channels.get(DB.get(svid).TELECHAN)

  let emb = new gear.Discord.RichEmbed 
  emb.setAuthor("Nova mensagem remota de "+message.guild.name,message.guild.iconURL)
  emb.description = "**"+message.author.tag+"**: "+ mess
  emb.setFooter("Digite | "+DB.get(message.guild.id).modules.PREFIX+"tele "+message.guild.id+" <mensagem> | para responder")
dest.send({embed:emb}).then(m => message.channel.send("Enviado para "+sv.name)).catch(e=>message.channel.send("Deu ruim"))

}
 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'misc'
};
