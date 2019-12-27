const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
//const locale = require('../../../utils/multilang_b');
//const mm = locale.getT();
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
    const sharduptime = (bot.uptime/1000+"").toHHMMSS();
    const botuptime = (process.uptime()+"").toHHMMSS();

//HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
    if (MSG.split(/ +/)[1]==helpkey || MSG.split(/ +/)[1]=="?"|| MSG.split(/ +/)[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------

let emb =    new Discord.MessageEmbed();

let ramC = Math.round(util.inspect(process.memoryUsage().heapUsed) / 1000000)
let ramB = Math.round(util.inspect(process.memoryUsage().heapTotal) / 1000000)
let ramA = ramC+"~"+ramB

emb.setColor('#e83774')
let SHARDATA=(await gear.globalDB.get()).shardData;
  let totalservs= Object.keys(SHARDATA).map(x=>x).map(y=>SHARDATA[y].servers).reduce((prev, val) => prev + val, 0),
  totalchans= Object.keys(SHARDATA).map(x=>x).map(y=>SHARDATA[y].channels).reduce((prev, val) => prev + val, 0),
totalusers= Object.keys(SHARDATA).map(x=>x).map(y=>SHARDATA[y].users).reduce((prev, val) => prev + val, 0);
  let PING=bot.ws.ping||bot.ping||10

let a = gear.randomize(2,4)
//emb.setAuthor('Pollux Stats',bot.user.displayAvatarURL({format:'png'})'https://pollux.fun/')
emb.setThumbnail(bot.user.avatarURL)
emb.addField('\u200b','𝚂𝚘𝚌𝚒𝚊𝚕 𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚝𝚒𝚘𝚗 ',false)
//emb.addField(':microphone2:   Voice Channels ',"```"+(bot.voiceConnections.size)+"```", true)
emb.addField(gear.emoji('mobo')+'   Servers',"```ml\n"+gear.miliarize(totalservs,true)+"```", true)
//emb.addField(':hash:   Channels ',"```xl\n"+gear.miliarize(totalchans)+"+```", true)
emb.addField(':busts_in_silhouette:    Users',"```ml\n"+gear.miliarize(totalusers)+"+```", true)

emb.addField('\u200b','𝚃𝚎𝚌𝚑𝚗𝚒𝚌𝚊𝚕 𝚂𝚝𝚊𝚝𝚞𝚜 ',false)
//emb.addField(gear.emoji('mobo')+'   Servers in this Shard',"```css\n"+(`[${Number(process.env.SHARD)+1}/${process.env.TOTAL_SHARDS}] `)+(bot.guilds.size)+"```", true)
emb.addField(gear.emoji('cog')+'   Ping',"```ml\n"+parseFloat(Math.round(PING * 100) / 100).toFixed(0)+'ms'+"```", true)
emb.addField(gear.emoji('memslot')+'    RAM Usage',"```ml\n"+ramA+" MB```", true)
//emb.addField('\u200b','𝙲𝚘𝚛𝚎',false)
//emb.addField(gear.emoji('comp')+'   Server Uptime',"```ml\n"+uptime+"```", true)
emb.addField(gear.emoji('mobo')+'   Servers in this Shard              \u200b',"```css\n"+(`[${gear.getShardCodename(bot,Number(message.guild.shard.id)+1)} Shard] `)+(bot.guilds.filter(x=>x.shard.id==message.guild.shard.id).size)+"```", true)
emb.addField(gear.emoji('cpu')+'   Shard Uptime',"```ml\n"+(botuptime)+"```", true)
//emb.addField('\u200b','\u200b',true)
  //emb.addField('<:Crystal:338766079096782849>   Shard Uptime',"```ml\n"+(sharduptime)+"```", true)

  //let flag = await require('axios')({method:'get',url:"https://ipinfo.io"}).then(x=>x.data.country);
  //"http://icons.veryicon.com/png/Love/Valentine/heart.png"
  let url = `https://beta.pollux.gg/build/guessing/guessflags/germany.png`

emb.addField('\u200b'         ,'𝙻𝚒𝚗𝚔𝚜 ',false)
emb.addField('Donate'         ,"<a:polluxYAY:482436838523404288>  https://patreon.com/Pollux", true)
emb.addField('Invite'         ,':love_letter:  https://pollux.fun/invite     \u200b', true)
emb.addField('Commands'       ,':gear:  https://pollux.fun/commands', true)
emb.addField('Support Server' ,':question:  https://pollux.fun/support    \u200b', true)
emb.addField('Twitter'        ,'<:twitter:510526878139023380>  https://twitter.com/maidPollux    \u200b', true)
emb.addField('Subreddit'      ,'<:reddit:510526878038360074>   https://reddit.com/r/Pollux    \u200b', true)

emb.setFooter("Falkenstein - DE  |  Powered by "+os.cpus().length+"x "+os.cpus()[1].model,url)


  message.channel.send({embed:emb})

}
module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: 'infra',botperms:["EMBED_LINKS"]};
