const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const os = require('os');
const Discord = require('discord.js');
const util = require('util')

const cmd = 'stats';

const init = async function (message,userDB,DB) {

const MSG = message.content;
const bot = message.botUser

const LANG = message.lang;


  function getServs() {
    return message.botUser.shard.fetchClientValues('guilds.size').then(rst => {
          console.log(rst)
            r = rst.reduce((a, b) => a + b);
            let users = r;
            let g = rst.reduce((prev, val) => prev + val, 0);
            return g
        }).catch(e=> {});

}


//-------MAGIC----------------

    String.prototype.toHHMMSS = function () {
    let sec_num = parseInt(this, 10);
    let hours   = Math.floor(sec_num / 3600);
    let days   = Math.floor(hours / 24);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    let time    = hours+'h '+minutes+'m '+seconds+'s';
        days > 1 ? time = days+" days " : time = time
    return time;
}
    const uptime = (os.uptime() + "").toHHMMSS();
    const botuptime = (bot.uptime/1000+"").toHHMMSS();

//HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
    if (MSG.split(/ +/)[1]==helpkey || MSG.split(/ +/)[1]=="?"|| MSG.split(/ +/)[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------

let emb =    new Discord.RichEmbed();

let ramC = Math.round(util.inspect(process.memoryUsage().heapUsed) / 1000000)
let ramB = Math.round(util.inspect(process.memoryUsage().heapTotal) / 1000000)
let ramA = ramB-ramC

emb.setColor('#e83774')

  let totalservs=await getServs();

let a = gear.randomize(2,4)
//emb.setAuthor('Pollux Stats',bot.user.avatarURL,'https://pollux.fun/')

emb.addField('\u200b','𝚂𝚘𝚌𝚒𝚊𝚕 𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚝𝚒𝚘𝚗 ',false)
//emb.addField(':microphone2:   Voice Channels ',"```"+(bot.voiceConnections.size)+"```", true)
emb.addField(gear.emoji('mobo')+'   Servers',"```ml\n"+gear.miliarize(totalservs,true)+"```", true)
emb.addField(':hash:   Channels ',"```xl\n"+gear.miliarize(bot.channels.size*2)+"+```", true)
emb.addField(':busts_in_silhouette:    Users',"```ml\n"+gear.miliarize(bot.users.size*3)+"+```", true)

emb.addField('\u200b','𝚃𝚎𝚌𝚑𝚗𝚒𝚌𝚊𝚕 𝚂𝚝𝚊𝚝𝚞𝚜 ',false)
emb.addField(gear.emoji('mobo')+'   Servers in this Shard',"```css\n"+(`[${bot.shard.id+1}/${bot.shard.count}] `)+(bot.guilds.size)+"```", true)
emb.addField(gear.emoji('cog')+'   Ping',"```ml\n"+parseFloat(Math.round(bot.ping * 100) / 100).toFixed(0)+'ms'+"```", true)
emb.addField(gear.emoji('memslot')+'    RAM Usage',"```ml\n"+ramA+" MB```", true)

emb.addField('\u200b','𝙲𝚘𝚛𝚎',false)
emb.addField(gear.emoji('comp')+'   Server Uptime',"```ml\n"+uptime+"```", true)
emb.addField(gear.emoji('cpu')+'   Process Uptime',"```ml\n"+(botuptime)+"```", true)
let url ="http://icons.veryicon.com/png/Love/Valentine/heart.png"

emb.addField('Donate',":moneybag:  https://patreon.com/Pollux", true)
emb.addField('Invite',':love_letter:  http://pollux.fun/invite     \u200b', true)
emb.addField('Commands',':gear:  http://pollux.fun/commands', true)
emb.addField('Support Server',':question:  http://pollux.fun/support    \u200b', true)

emb.setFooter("Heart kept beating by "+os.cpus().length+"x "+os.cpus()[1].model,url)


  message.channel.send({embed:emb})

}
module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: 'infra'};
