
var gear = require("../../gearbox.js");
var paths = require("../../paths.js");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();


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

    //HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
if (message.content.split(/ +/)[1]==helpkey || message.content.split(/ +/)[1]=="?"|| message.content.split(/ +/)[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------
    String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var days   = Math.floor(hours / 24);

    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+'h '+minutes+'m '+seconds+'s';
        days > 1 ? time = days+" dias " : time = time
    return time;
}

    var time = bot.uptime/1000;
    var uptime = (time + "").toHHMMSS();





 emb =    new gear.Discord.RichEmbed();



        emb.setColor('#e05757')
    emb.title = "Listing newly added or modified Commands and Features"

a = gear.randomize(2,4)
    emb.setAuthor('Pollux Encore',bot.user.avatarURL,'http://pollux.fun')
    emb.setThumbnail('https://github.com/LucasFlicky/polluxbot/blob/master/avis/'+a+'.gif?raw=true')


  //emb.setThumbnail("https://raw.githubusercontent.com/LucasFlicky/polluxbot/master/avis/display.png")
  // emb.setImage("https://raw.githubusercontent.com/LucasFlicky/polluxbot/master/avis/2.png")
    emb.description = `Invite: http://www.pollux.fun/invite
Commands: http://www.pollux.fun/commands
Support: https://discord.gg/ay48h7Q


`

      emb.addField('+ban [@user] [reason]',"Bans a member", false)
      emb.addField('+color [RGB]',"~COLORS~", false)
      emb.addField('+vaporwave',"Plays Vapor on VC", false)
      emb.addField('+logs [channel]',"Logs info into a channel", false)
      emb.addField('pollux+nuke',"Deletes server info (bot database) Admin-only", false)
      emb.addField('+chinese [text]',"Writes stuff in pseudo-chinese", false)
      emb.addField('+rotation-hots',"Updated with Hero Icons", false)
      emb.addField('+ahegao',"Self-explanatory, NSFW", false)
      emb.addField('+saltlevel',"Updated", false)
//      emb.addField('+serverinfo',"EXPERIMENTAL", true)



    message.channel.send({embed:emb})





}
 module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: 'info'};
