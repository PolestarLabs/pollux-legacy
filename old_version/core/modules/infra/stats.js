
var gear = require("../../gearbox.js");
var paths = require("../../paths.js");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();
var os = require('os');
var util = require('util')


var cmd = 'stats';

var init = function (message,userDB,DB) {
var Server = message.guild;
var Channel = message.channel;
var Author = message.author;
if (Author.bot) return;
var Member = Server.member(Author);
var Target = message.mentions.users.first() || Author;
var MSG = message.content;
var bot = message.botUser
var args = MSG.split(' ').slice(1)[1]
var LANG = message.lang;

//-------MAGIC----------------

try{
    String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours   = Math.floor(sec_num / 3600);
    var days   = Math.floor(hours / 24);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+'h '+minutes+'m '+seconds+'s';
        days > 1 ? time = days+" days " : time = time
    return time;
}


    var uptime = (os.uptime() + "").toHHMMSS();
    var botuptime = (bot.uptime/1000+"").toHHMMSS();



//HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
if (MSG.split(" ")[1]==helpkey || MSG.split(" ")[1]=="?"|| MSG.split(" ")[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------




 emb =    new gear.Discord.RichEmbed();

let ramC = Math.round(util.inspect(process.memoryUsage().heapUsed) / 1000000)
let ramB = Math.round(util.inspect(process.memoryUsage().heapTotal) / 1000000)
let ramA = ramB-ramC



        emb.setColor('#e83774')
    emb.title = "---"

a = gear.randomize(2,4)
    emb.setAuthor('Pollux Statistics',bot.user.avatarURL,'https://pollux.fun/')
//   emb.setThumbnail('https://github.com/LucasFlicky/polluxbot/blob/master/avis/'+a+'.gif?raw=true')


  //emb.setThumbnail("https://raw.githubusercontent.com/LucasFlicky/polluxbot/master/avis/display.png")
  // emb.setImage("https://raw.githubusercontent.com/LucasFlicky/polluxbot/master/avis/2.png")
    //emb.description = "Os Top-5 mais rubificadoss do server"

      emb.addField(':hash:   Channels ',"```"+(bot.channels.size)+"```", true)
      emb.addField(':microphone2:   Voice Channels ',"```"+(bot.voiceConnections.size)+"```", true)
   //   emb.addField(':hash:   Voice Channels',"```"+()+"```", true)
      emb.addField(gear.emoji('mobo')+'   Servers',"```"+(bot.guilds.size)+"```", true)
      emb.addField(':busts_in_silhouette:    Users',"```"+(bot.users.size)+"```", true)
      emb.addField(gear.emoji('cog')+'   Ping',"```"+parseFloat(Math.round(bot.ping * 100) / 100).toFixed(0)+'ms'+"```", true)
      emb.addField(gear.emoji('memslot')+'    RAM Usage',"```"+ramA+" MB```", true)
      emb.addField(gear.emoji('comp')+'   Server Uptime',"```"+uptime+"```", true)
      emb.addField(gear.emoji('cpu')+'   Process Uptime',"```"+(botuptime)+"```", true)
emb.addBlankField()
     let url ="http://icons.veryicon.com/png/Love/Valentine/heart.png"

 emb.addField('Donate',"https://patreon.com/Pollux                ", true)
 emb.addField('Invite','http://goo.gl/qkGqqU', true)
emb.addBlankField()
 emb.addField('Commands','http://pollux.fun/commands', true)
 emb.addField('Support Server','https://discord.gg/ay48h7Q', true)
  emb.setFooter("Heart kept beating by "+os.cpus().length+"x "+os.cpus()[0].model,url)
emb.addBlankField()



    message.channel.send({embed:emb})



}catch(e){console.log(e)}

}
 module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: 'infra'};
