var paths = require("../../paths.json");
var gear = require("../../gearbox.js");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();


var cmd = 'bye';
const userDB = gear.userDB
const DB = gear.serverDB


const init = async function (message) {

  try{
    const Server = message.guild;
    const Channel = message.channel;
    const Author = message.author;
    if (Author.bot) return;
    const Member = Server.member(Author);
    const Target = message.mentions.users.first() || Author;
    const MSG = message.content;
    const bot = message.botUser
    let mainf = MSG.split(/ +/).slice(1).join(' ');
    let arg = mainf.split(' ').slice(1).join(' ');
    let On      = gear.emoji("check")
    let Off     = gear.emoji("xmark")

    const LANG = message.lang;

    let helpkey = mm("helpkey",{lngs:message.lang});
    if (MSG.split(" ")[1]==helpkey || MSG.split(" ")[1]=="?"|| MSG.split(" ")[1]=="help"){
        return gear.usage(cmd,message,"mod");
    };
    SERVERDATA = await gear.serverDB.findOne({id:message.guild.id});

    const modPass = gear.hasPerms(Member,SVDATA);
    if (!modPass) {
        return message.reply(mm('CMD.moderationNeeded', {
            lngs: LANG
        })).catch(console.error);
    };

    const v = {
        inON: On+mm('greet.byeON', {
            lngs: LANG
        }),
        inOFF: Off+mm('greet.byeOFF', {
            lngs: LANG
        }),
        inTX: mm('greet.outTex', {
            lngs: LANG
        }),
        inCX: mm('greet.outChan', {
            lngs: LANG
        }),
        tellMsg: mm('greet.tellmeMSG', {
            lngs: LANG
        }),
        tellChn: mm('greet.tellmeCHN', {
            lngs: LANG
        }),
        noTimer: mm('greet.noTimer', {
            lngs: LANG
        })
    };

  async function setMsg(msg){
    if (!msg) return message.channel.send(v.tellMsg);
    if (msg.length < 2) return message.channel.send(v.tellMsg);
    await gear.serverDB.set(Server.id,{$set:{'modules.FWELL.text':msg}});
    return message.channel.send(v.inTX);
  };
  async function setChan(message){
    let setchan;
    let chaname;
    if(message.mentions.channels){
      setchan = message.mentions.channels.first().id;
      chaname = message.mentions.channels.first().name;
    }else{
      let namedec = message.content.split(/ +/).slice(2).join('-').toLowerCase();
      setchan = (message.guild.channels.find(ch=>ch.name.toLowerCase() === namedec)||{id:false}).id;
      chaname = (message.guild.channels.find(ch=>ch.name.toLowerCase() === namedec)||{id:false}).name;
    };
    if(!setchan){
      return message.channel.send(v.tellChn)
    };
    await gear.serverDB.set(Server.id,{$set:{'modules.FWELL.channel':setchan}});
    return message.channel.send(mm('greet.outChan', {
            lngs: LANG,
            channel: "#"+chaname,
        }));
  };
  async function toggleBye(){
    async function turn(state){
      await gear.serverDB.set(Server.id,{$set:{'modules.FWELL.enabled':state}});
      if (state) return message.channel.send(v.inON);
      else  return message.channel.send(v.inOFF);
    }
    SVDATA.modules.FWELL.enabled ? turn(false) : turn(true);
  };
  async function setTime(arg){
    if (!isNaN(Number(arg))){
      let time = Number(arg)*1000;
      await gear.serverDB.set(Server.id,{$set:{'modules.FWELL.timer':time}});
      return message.channel.send(mm('greet.timerby', {
            lngs: LANG,
            timeMin: arg,
        }));
    }else{
      await gear.serverDB.set(Server.id,{$set:{'modules.FWELL.timer':false}});
      return message.channel.send(v.noTimer);
    };
  };

  mainf = mainf.split(' ')[0];

  if (mainf === 'msg' ) setMsg(arg);
  if (mainf === 'timer' ) setTime(arg);
  if (['chn','channel'].includes(mainf)) setChan(message);
  if (!mainf||mainf===''||(mainf.length&&mainf.length===0)) toggleBye();

  }catch(e){console.error(e)}

}


module.exports = {
    pub: true,
    cmd: cmd,
    perms: 0,
    init: init,
    cat: 'mod'
};
