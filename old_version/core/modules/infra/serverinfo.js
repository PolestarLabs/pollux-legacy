

var gear = require("../../gearbox.js");
var paths = require("../../paths.js");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();


var cmd = 'svinfo';

var init = function (message,userDB,DB) {

var MSG = message.content;
var args = MSG.split(' ').slice(1).join(' ')
  

var bot = message.botUser
var Server = !args? message.guild: args=='random'? bot.guilds.random() :bot.guilds.get(args) ||bot.guilds.find('name',args) ||message.guild;
var Channel = message.channel;
var Author = message.author;
if (Author.bot) return;
var Member = Server.member(Author);
var Target = message.mentions.users.first() || Author;
var LANG = message.lang;

var G = Server


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
        days > 1 ? time = days+" days " : time = time
    return time;
}

    var time = bot.uptime/100;
    var uptime = (time + "").toHHMMSS();






 emb =    new gear.Discord.RichEmbed();



var rubine    = gear.emoji("rubine")
var On      = gear.emoji("check")
var Off     = gear.emoji("xmark")

        emb.setColor('#e83774')
    emb.title = "_____________"

a = gear.randomize(2,4)
    emb.setAuthor(Server.name,Server.iconURL,'')
    emb.setFooter("Server created at")
    emb.setTimestamp(Server.createdAt)
    emb.setThumbnail(Server.iconURL)


  //emb.setThumbnail("https://raw.githubusercontent.com/LucasFlicky/polluxbot/master/avis/display.png")
  // emb.setImage("https://raw.githubusercontent.com/LucasFlicky/polluxbot/master/avis/2.png")
    //emb.description = "Os Top-5 mais rubificadoss do server"


function flag(){


        let R = Server.region
        switch (true) {
            case R.includes("eu-"):
                return ":flag_eu: +" + R.substr(3)[0].toUpperCase();
                break;
            case R.includes("us-"):
                return ":flag_us: " + R.substr(3)[0].toUpperCase();
                break;
            case R.includes("brazil"):
                return ":flag_br:";
                break;
            case R.includes("singapore"):
                return ":flag_sg:";
                break;
            case R.includes("hongkong"):
                return ":flag_hk:";
                break;
            case R.includes("russia"):
                return ":flag_ru:";
                break;
            case R.includes("sydney"):
                return ":flag_au:";
                break;
            default:
                return ":map: " + R;
                break;

        }
    }
function flagLang(){


        let R = G.dDATA.modules.LANGUAGE
        switch (true) {
            case R === "en":
                return ":flag_gb:";
                break;
                 case R === "pt-BR":
                return ":flag_br:";
                break;
                 case R === "pt":
                return ":flag_br:";
                break;
            default:
                return "flag_ca: " + R;
                break;

        }
    }

    var flag = flag()
    var flagLang = flagLang()

var TC = Server.channels.filter(c=>c.type=="text")
var VC = Server.channels.filter(c=>c.type=="voice")
var OM = Server.members.filter(m=>m.presence.status=="offline").size
var online = (Server.members.size)-OM

var modrole;

    if (G.dDATA.modules.MODROLE != undefined) {modrole = G.roles.get(G.dDATA.modules.MODROLE);}else{modrole = "NONE";}

var autoroles = G.dDATA.modules.AUTOROLES.length
var lang = G.dDATA.modules.LANGUAGE
var greet = G.dDATA.modules.GREET
var bye = G.dDATA.modules.FWELL
var mods = G.dDATA.modules.DISABLED
mods = mods.removeire("cog")

    var c = et(G.dDATA.modules.NSFW)
    var a = et(G.dDATA.modules.LVUP)
    var b = et(G.dDATA.modules.DROPS)

    emb.addField(":tophat: Owner", Server.owner.user , true)

    emb.addField(":coffee: Main Channel",Server.defaultChannel, true)
   emb.addField(" :scales: Moderation Role", modrole , true)
   emb.addField(" :busts_in_silhouette: Members",online +"/"+ Server.members.size, true)



    emb.addField(":hash: Channels","```"+ TC.size +"```", true)
   emb.addField(" :microphone2: Voice Channels ","```"+VC.size +"```", true)


   emb.addField(" :package: Auto Roles","```"+ autoroles +"```", true)
   emb.addField(" :package: Roles ","```"+ Server.roles.size +"```", true)

   emb.addField("Region",flag, true)
   emb.addField("Language", flagLang , true)


   emb.addField(" :inbox_tray: Greeting Message ","`"+greet.joinText+"`" +et(greet.hi)+" @ "+Server.channels.get(greet.greetChan), false)
   emb.addField(" :outbox_tray: Bye Message ","`"+bye.joinText +"`"+et(bye.hi)+" @ "+Server.channels.get(bye.greetChan), false)

  emb.addField(":gear: SuperModules",`:up: ${a} LevelUp Messages
${rubine}${b} Rubine Drops
:underage: ${c} NSFW Master-Switch`, true)
  emb.addField(":gear: Disabled Commands","```."+ mods +"```", true)



//  emb.addField("  :calendar_spiral: Creation Date", Server.createdAt , true)


    message.channel.send({embed:emb})




    function et(inp){
        if (inp===true){return On}
        if (inp===false){return Off}
        if (inp===undefined){return"---"}
    }















}




 module.exports = {
    pub:false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'infra'
};
