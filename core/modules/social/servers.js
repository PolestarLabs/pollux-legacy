const arraySort = require('array-sort')
const fs = require("fs");
const gear = require('../../gearbox.js')

const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'rank';

const init = function (message) {
const Server = message.guild;
const Channel = message.channel;
const MSG = message.content;
const bot = message.botUser
const args = MSG.split(' ').slice(1)[0]
const LANG = message.lang;

//-------MAGIC----------------

 emb =    new gear.Discord.RichEmbed();
    emb.title = "Server Leaderboards"
    emb.description = "Servers sort by Member Count: No Servers with bot count > 15%"

 //emb.setThumbnail("https://raw.githubusercontent.com/LucasFlicky/polluxbot/master/avis/6.png")
     if (args === "sv"|| args =="server"||args=="guild"||args=="s") {
                    emb.title = "Server Leaderboards"
 //emb.setThumbnail(Server.iconURL)
     }
     var rankItem = []
        var ranked = []
        var iter = 0
        var aiter = 0
        var baiter = 0
        bot.guilds.forEach(i=>{
            iter++
            aiter = (i.members.size + aiter)
            let botamt = i.members.filter(m=> m.user.bot).size
            baiter = ((i.members.size - i.members.filter(m=> m.user.bot).size)+ baiter)
          var  psent = (botamt / i.members.size)*100
if(psent >= 15) return;

        if (i.id=="110373943822540800")return;
            rankItem.exp = i.members.size
            rankItem.level = flag(i.region)
            rankItem.name = (i.name)
            rankItem.id = (i.id)

            rankItem.bots = (botamt)
            ranked.push(rankItem)
            rankItem = []
        })
        arraySort(ranked, 'exp', {
            reverse: true
        })
    emb.setColor('#da5bae')
    emb.setAuthor('Pollux',bot.user.avatarURL,'http://pollux.fun')

 emb.setFooter("Mean Server Size: "+(aiter/ iter ).toFixed(2)+" || Nonbots: "+(baiter/ iter ).toFixed(2))

var medals = [':first_place: 1st',
':second_place: 2nd',
':third_place: 3rd',
':medal: 4th',
':medal: 5th'
]
console.log("WALRUS")
for (i=0;i<ranked.length;i++){
    if (i < 5){
         console.log(ranked[i])
         console.log(medals[i])
      emb.addField(medals[i],"```"+ranked[i].name+"``` \n  ID - "+ranked[i].id, false)
      emb.addField('Region :'+ranked[i].level,'**'+ranked[i].exp + '** Members', true)
       var parsent =  (ranked[i].bots / ranked[i].exp)*100
      emb.addField("Bots",ranked[i].bots+" "+gear.emoji("botTag")+" ("+parsent.toFixed(2)+"%)", true)
    }
}
    message.channel.send({embed:emb}).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())})

function flag(input){
        let R = input
        switch (true) {
            case R.includes("eu-"):
                return ":flag_eu: " + R.substr(3)[0].toUpperCase();
                break;
            case R.includes("us-"):
                return ":flag_us: " + R.substr(3)[0].toUpperCase();
                break;
            case R.includes("brazil"):
                return ":flag_br:";
                break;
            case R.includes("london"):
                return ":flag_gb:";
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

}
 module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: 'misc'};

