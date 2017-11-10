const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'modrole';

const init = async function (message, userDB, DB) {

    const Server = message.guild;
    const Channel = message.channel;
    const Author = message.author;
    if (Author.bot) return;
    const Member = Server.member(Author);
    const Target = message.mentions.roles.first();
    const MSG = message.content;
    const bot = message.botUser
    const args = MSG.split(/ +/).slice(1).join(' ')

    const LANG = message.lang;

const P = {lngs:message.lang};
if(gear.autoHelper([mm("helpkey",P)],{cmd,message,opt:this.cat}))return;
if(gear.autoHelper(['noargs'],{cmd,message,opt:this.cat})) return message.reply(mm('CMD.noRolesGiven',{lngs:LANG,role:args}));
//------------
const modPass = gear.hasPerms(Member,DB);
if (!modPass)return message.reply(mm('CMD.moderationNeeded',P)).catch(e=>console.warn);

const rolenotfound = mm('CMD.nosuchrole', P);
const noPermsMe = mm('CMD.unperm', P);
  if(args.startsWith('delete')){
    await gear.serverDB.set(Server.id,{$set:{'modules.MODROLE':undefined}});
      let embed = new gear.RichEmbed
  embed.setColor("#8e4848")
  embed.setDescription(gear.emoji('nope')+"**MOD** Role: ---");
  return message.channel.send({embed});
  }

let a = Server.roles.find(rol=>rol.name.toLowerCase()==args.toLowerCase()||rol.name.toLowerCase().includes(args.toLowerCase()));
if (message.mentions.roles.size>0){
a = message.mentions.roles.first()
}
if(!a){
return message.reply(rolenotfound)
}
message.delete(8000).catch();


await gear.serverDB.set(Server.id,{$set:{'modules.MODROLE':a.id}});
  let embed = new gear.RichEmbed
  embed.setColor(a.hexColor)
  embed.setDescription(gear.emoji('yep')+"**MOD** Role: "+a);
  message.channel.send({embed});
}
module.exports = {pub:false,cmd: cmd, perms: 2, init: init, cat: 'mod'};
