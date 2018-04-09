const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'roleme';

const On = gear.emoji("yep");
const Off = gear.emoji("nope");

const init = function (message) {
    const Server = message.guild;
    const Channel = message.channel;
    const Member = message.member;
    const Target = message.mentions.members.first() || Member;
    const MSG = message.content;
    const bot = message.botUser;
    let args = MSG.split(/ +/).slice(1).join(' ')
    const LANG = message.lang;

  if(!args){
    let clone = message
    clone.content = "p!selfroles list"
    return require('./selfroles.js').init(clone);
  }
    let remove = false;
    if(args.startsWith('out')){
      remove = true;
      args = args.split(/ +/).slice(1).join(' ');
    }


   let selfies = Server.dDATA.modules.SELFROLES
  if(!selfies){
     return message.channel.send(Off+mm('CMD.noselfRoles', {lngs: message.lang}));
     };



    if(
       selfies.map(x=>x[0]).includes(args)||
       selfies.map(x=>x[1].toLowerCase()).includes(args.toLowerCase())||
       selfies.map(x=>x[0]).includes((message.mentions.roles.first()||{id:undefined}).id)||
      selfies.map(x=>Server.roles.get(x[0]).name.toLowerCase()).find(f=>f.includes(args.toLocaleLowerCase()))
      ){

      let role= message.guild.roles.get((selfies[selfies.map(x=>x[1]).indexOf(args)]||[false])[0])

      if(!role) role= message.guild.roles.get(args);
      if(!role) role= message.mentions.roles.first();
      if(!role) role= message.guild.roles.find(rl=>rl.name.toLowerCase().includes(args.toLowerCase()) && selfies.find(r=>r[0]==rl.id));


      //if(!Server.me.highestRole.comparePositionTo(role)<=0) return message.channel.send(Off+mm('CMD.unperm', {lngs: message.lang}));

      if(!role) return message.channel.send(Off+mm('CMD.nosuchrole', {lngs: message.lang}));

      if(remove){
        Member.removeRole(role).then(ok=>{
          message.channel.send(Off+mm("CMD.rolermCom",{
            langs:message.lang
            ,user:Member.displayName
            ,group:role.name
          })).then(m=>m.delete(5500).catch())
        }).catch(e=>{console.log(e)});
      }else{
        Member.addRole(role).then(ok=>{
          message.channel.send(On+ mm("CMD.roleadCom",{
            langs:message.lang
            ,user:Member.displayName
            ,group:role.name
          })).then(m=>m.delete(5500).catch())
        }).catch(e=>console.log(e));
      }

    }else{
      return message.channel.send(Off+mm('CMD.nosuchrole', {lngs: message.lang}));
    }
      message.delete(1000).catch();
}

module.exports = {
    pub: false,
    cmd: cmd,
    perms: 4,
    init: init,
    cat: 'community'
};
