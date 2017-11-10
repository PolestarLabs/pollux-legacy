const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const os = require('os');
const Discord = require('discord.js');
const util = require('util')

const cmd = 'stats';

const init = function (message,userDB,DB) {

const MSG = message.content;
const bot = message.botUser

const LANG = message.lang;

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

let a = gear.randomize(2,4)
emb.setAuthor('Pollux Stats',bot.user.avatarURL,'https://pollux.fun/')

emb.addField(':hash:   Channels ',"```"+(bot.channels.size)+"```", true)
emb.addField(':microphone2:   Voice Channels ',"```"+(bot.voiceConnections.size)+"```", true)
emb.addField(gear.emoji('mobo')+'   Servers',"```"+(bot.guilds.size)+"```", true)
emb.addField(':busts_in_silhouette:    Users',"```"+(bot.users.size)+"```", true)
emb.addField(gear.emoji('cog')+'   Ping',"```"+parseFloat(Math.round(bot.ping * 100) / 100).toFixed(0)+'ms'+"```", true)
emb.addField(gear.emoji('memslot')+'    RAM Usage',"```"+ramA+" MB```", true)
emb.addField(gear.emoji('comp')+'   Server Uptime',"```"+uptime+"```", true)
emb.addField(gear.emoji('cpu')+'   Process Uptime',"```"+(botuptime)+"```", true)
let url ="http://icons.veryicon.com/png/Love/Valentine/heart.png"

emb.addField('Donate',":moneybag:  https://patreon.com/Pollux", true)
emb.addField('Invite',':love_letter:  http://goo.gl/qkGqqU        .', true)
emb.addField('Commands',':gear:  http://pollux.fun/commands', true)
emb.addField('Support Server',':question:  https://discord.gg/ay48h7Q', true)

emb.setFooter("Heart kept beating by "+os.cpus().length+"x "+os.cpus()[0].model,url)


  message.channel.send({embed:emb})

}
module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: 'infra'};
