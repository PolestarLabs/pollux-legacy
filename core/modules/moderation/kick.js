const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
//const locale = require('../../../utils/multilang_b');
//const mm = locale.getT();

const cmd = 'kick';

const init = async function (message) {

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

    const noperms     =   mm('CMD.moderationNeeded', P)
    const KICKED      =   mm('dict.kicked', P)
    const wasKICKED   =   mm('dict.waskicked', P)
    const REASON      =   mm('dict.reason', P)
    const RESPO       =   mm('dict.responsible', P)
    const whokik      =   mm('CMD.kinNone', P)
    const nope        =   mm('CMD.kin404', P)
    const noPermsMe   =   mm('CMD.unperm', P)
    const justasec    =   mm('CMD.jas', P)
    const noReason    =   mm('CMD.noReason', {lngs:LANG, target:Target.user.tag})
    const didkik      =   mm('CMD.didkik', {lngs:LANG, target:Target.user.tag,reason:reason})

   reason=reason?reason:noReason;
let ServerDATA = await gear.serverDB.findOne({id:Server.id},{"modules.LOCALRANKx":0});
  
    const modPass = await gear.hasPerms(Member,ServerDATA);

    if (!modPass)return message.reply(mm('CMD.moderationNeeded',P)).catch(e=>console.warn);
    if (message.mentions.users.size === 0)return message.reply(whokik).catch();

    let kickMember = Target;
    if (!kickMember)return message.reply(nope);
    if (!Server.member(bot.user).hasPermission("KICK_MEMBERS"))return message.reply(noPermsMe).catch();

 kickMember.kick().then(kicked=>{
   Channel.send(didkik)
 }).catch(e=>{
   message.reply(gear.emoji('nope'));
 })
    message.delete({timeout:1000}).catch();
}
 module.exports = {pub:true,cmd: cmd, perms: 2, init: init, cat: 'mod', botperms: ["KICK_MEMBERS"]};
