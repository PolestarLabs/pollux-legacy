const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'selfroles';

const On = gear.emoji("yep");
const Off = gear.emoji("nope");

function getRole(sub,message){

      let role = message.guild.roles.find(rol=>
                                        rol.name.toLowerCase()==sub.toLowerCase()||
                                        rol.name.toLowerCase().includes(sub.toLowerCase())
                                       );
      if (message.mentions.roles.size>0){
        role = message.mentions.roles.first();
      }
      if (!role)role = message.guild.roles.get(sub);
      if(!role)return false;
      return role;
    };

function add(sub,svData,m){
    if((svData.modules.SELFROLES||[]).length==25)
        return m.channel.send(Off+mm('CMD.autoroleLimit', {lngs: m.lang})).catch();
    let key;
    if(sub.includes('"')){
     let A=sub.match(/(".*?"|[^"]+)(?=\s|\s*$)/g);
      console.log(A)
      sub = A[0];
      key = A[1].replace(/"/g,"");
    };

    let role = getRole(sub,m);

    if(!role){
      return m.channel.send(Off+ mm('CMD.nosuchrole', {lngs:m.lang}));
    };

    if(!key)key=role.name;

      let selfies = svData.modules.SELFROLES||[];
     if(selfies.length>0){
       if(role && selfies.map(x=>x[0]).includes(role.id)){
        return m.channel.send(Off+ mm('CMD.roleAlreadyHere', {lngs:m.lang}));
      }
     };
    gear.serverDB.findOneAndUpdate({id:svData.id},{$push:{'modules.SELFROLES':[role.id,key]}})
          .then(ok=>{
     // console.log(ok)
      svData.modules.SELFROLES = ok.modules.SELFROLES;
    return m.channel.send(On+mm('CMD.roleAdded', {lngs: m.lang,role: role.name})).catch();
    });

};
function del(sub,svData,m){
    let role = getRole(sub,m);
    let selfies = svData.modules.SELFROLES
    if(!role && selfies.map(x=>x[1]).includes(sub)){
      role= m.guild.roles.get(selfies[selfies.map(x=>x[1]).indexOf(sub)][0])
    }
    if(!role){
      return m.channel.send(Off+ mm('CMD.nosuchrole', {lngs:m.lang}));
    };
    selfies.splice(selfies.map(x=>x[0]).indexOf(role.id),1);
    gear.serverDB.findOneAndUpdate({id:m.guild.id},{$set:{'modules.SELFROLES':selfies}})
          .then(ok=>{
      svData.modules.SELFROLES = ok.modules.SELFROLES;
    return m.channel.send(On+ mm('CMD.selfroleunAdded', {lngs: m.lang,role: role.name})).catch();
    });
};

function list(svData,m){
  let list = (svData.modules.SELFROLES||[])
  let selfList = list.length;
  let embed = new gear.RichEmbed
  let columnA="**Role**";
  let columnB="Command\n";
  let columnA_cont="\u0305\n";
  let columnB_cont="\u0305\n";
  if (selfList>0){
    for(i=0;i<selfList;i++){
       columnA_cont += ":small_orange_diamond: "+m.guild.roles.get(list[i][0])+"\n";
       columnB_cont += ":small_blue_diamond: `"+m.prefix+"roleme "+list[i][1]+"`\n";
    }
    embed.setDescription('Remove: `' + m.prefix + 'roleme out`')
    embed.addField(columnA,columnA_cont,true)
    embed.addField(columnB,columnB_cont,true)
  }else{
    embed.setDescription(Off+mm('CMD.noselfRoles', {lngs: m.lang}))
  }
    embed.title = mm('dict.autoRolesforThis', {lngs: m.lang})
    embed.setColor('#4ab25a')
    embed.setAuthor(m.guild.name, m.guild.iconURL)
    m.channel.send({embed})
};

const init = function (message) {
    const Server = message.guild;
    const Channel = message.channel;
    const Member = message.member;
    const Target = message.mentions.members.first() || Member;
    const MSG = message.content;
    const bot = message.botUser;
    const args = MSG.split(/ +/).slice(1).join(' ')
    const LANG = message.lang;

      const P = {lngs:message.lang};
    if(gear.autoHelper([mm("helpkey",P),'noargs',''],{cmd,message,opt:this.cat}))return;
      if(args.length<2||args[1].includes("<"))return gear.autoHelper('force',{cmd,message,opt:this.cat});


    const noPermsMe = mm('CMD.unperm', P);
    let sub = args.split(/ +/).slice(1).join(' ')

    if (args.startsWith('list'))  return list(Server.dDATA,message);
        if (!gear.hasPerms(Member))return message.reply(mm('CMD.moderationNeeded',P));
    if (args.startsWith('add'))   return add(sub,Server.dDATA,message);
    if (args.startsWith('del'))   return del(sub,Server.dDATA,message);
    if (args.startsWith('clear')) return gear.serverDB.set(Server.id,{$set:{'modules.SELFROLES':[]}}).then(ok=>{
      return message.reply(mm('CMD.rolesCleared', {lngs: LANG}));
    })
    gear.autoHelper('force',{cmd,message,opt:this.cat});
}

module.exports = {
    pub: false,
    cmd: cmd,
    perms: 2,
    init: init,
    cat: 'mod'
};
