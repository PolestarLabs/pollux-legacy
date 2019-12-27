const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
//const locale = require('../../../utils/multilang_b');
//const mm = locale.getT();

const cmd = 'ban';

const init = async function (message) {

  try{

    const Server = message.guild;
    await  Server.members.fetch();
    const Channel = message.channel;
    const Author = message.author;
    const Member =message.member;
    const Target = Server.member(await gear.getTarget(message));
    const MSG = message.content;
    const bot = message.botUser
    const args = MSG.split(/ +/).slice(1).join(' ');
    let reason = args.split(' ').slice(1).join(' ');
    const LANG = message.lang;

//HELP TRIGGER
const P = {lngs:message.lang};
if(gear.autoHelper([mm("helpkey",P)],{cmd,message,opt:this.cat}))return;
if(gear.autoHelper(['noargs'],{cmd,message,opt:this.cat}));
//------------

    const noperms     =   mm('CMD.moderationNeeded', {lngs:LANG})
    const BANNED     =   mm('dict.banned', {lngs:LANG})
    const wasBANNED     =   mm('dict.wasbanned', {lngs:LANG})
    const REASON     =   mm('dict.reason', {lngs:LANG})
    const RESPO     =   mm('dict.responsible', {lngs:LANG})
    const whoban      =   mm('CMD.banNone', {lngs:LANG})
    const nope        =   mm('CMD.kin404', {lngs:LANG})
    const noPermsMe   =   mm('CMD.unperm', {lngs:LANG})
    const justasec    =   mm('CMD.jas', {lngs:LANG})
    const noReason      =   mm('CMD.noReason', {lngs:LANG, target:(Target.user||{tag:(Target.displayName||Target.username)}).tag})
    const didban        =   mm('CMD.didban', {lngs:LANG, target:Target.user.tag,reason:reason})

   reason=reason?reason:noReason;

    const modPass = await gear.hasPerms(Member,gear.serverDB);

    if (!modPass)return message.reply(mm('CMD.moderationNeeded',P)).catch(e=>console.warn);
    if (message.mentions.users.size === 0)return message.reply(whoban).catch();

    let banMember = Target;
    let ban = Target.user
    if (!banMember)return message.reply(nope);

    if (message.mentions.users.size === 0)return message.reply(whoban).catch(console.error);

    if (!Server.member(bot.user).hasPermission("BAN_MEMBERS")) return message.reply(noPermsMe).catch();

    if (!banMember.bannable) return message.reply("This Member cannot be banned").catch();

    let img = Target.displayAvatarURL

 banMember.ban(5).then(async ban=>{
      message.channel.send(didban);

let chanpoint;
SVDATA = await gear.serverDB.findOne({id:message.guild.id});

let logchan = SVDATA.modules.LOGCHANNEL
let advchan = SVDATA.modules.ADVLOG
let actchan = SVDATA.modules.ACTLOG
let modchan = SVDATA.modules.MODLOG

if( logchan && Server.channels.has(logchan)){chanpoint = Server.channels.get(logchan)}
if( modchan && Server.channels.has(modchan)){chanpoint = Server.channels.get(modchan)}

if (chanpoint){
  let id =  Target.id
  let mess = message
  let emb = new gear.RichEmbed;

  emb.setThumbnail(Target.avatarURL)
  emb.setTitle(":hammer: "+BANNED);
  emb.setDescription(`**${Target.username+"#"+Target.discriminator}** ${wasBANNED}`);
  //emb.addField("Channel",mess.channel,true)
  emb.addField(REASON, reason ,true)
  emb.addField(RESPO,Author,true)
  //emb.addField("Message",mess.content,true)
  emb.setColor("#f54510");
  var ts = new Date
  emb.setFooter("Ban",Target.avatarURL)
  emb.setTimestamp(ts)

  chanpoint.send({embed:emb}).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())})
}

 }).catch(e=>{
   message.reply(gear.emoji('nope'));
 })
    message.delete({timeout:1000}).catch();
}catch(e){
  console.error(e)
}
}
 module.exports = {pub:true,cmd: "ban", perms: 2, init: init, cat: 'mod', botperms: ["BAN_MEMBERS"]}
