var paths = require("../../paths.json");
var gear = require("../../gearbox.js");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();


var cmd = 'welcome';
const userDB = gear.userDB
const DB = gear.serverDB


var init = function (message) {
    var Server = message.guild;
    var Channel = message.channel;
    var Author = message.author;
    if (Author.bot) return;
    var Member = Server.member(Author);
    var Target = message.mentions.users.first() || Author;
    var MSG = message.content;
    var bot = message.botUser
    var args = MSG.split(' ').slice(1)
    var LANG = message.lang;





    let helpkey = mm("helpkey",{lngs:message.lang})
if (MSG.split(" ")[1]==helpkey || MSG.split(" ")[1]=="?"|| MSG.split(" ")[1]=="help"){
    return gear.usage(cmd,message,"mod");
}





    var modPass = gear.hasPerms(Member,DB)

    if (!modPass) {
        return message.reply(mm('CMD.moderationNeeded', {
            lngs: LANG
        })).catch(console.error);
    }

    let defaultgreet = {
                enabled: false,
                text: "Welcome to the Server %username%!",
                channel: {}
            }
if (!Server.dDATA.modules.GREET || Server.dDATA.modules.GREET===undefined){
    gear.serverDB.set(Server.id,{$set:{"modules.GREET":defaultgreet}})
}
   var On      = gear.emoji("check")
   var Off     = gear.emoji("xmark")

var input="X"
    var v = {
        inON: On+mm('greet.helloON', {
            lngs: LANG
        }),
        inOFF: Off+mm('greet.helloOFF', {
            lngs: LANG
        }),
        inTX: mm('greet.inTex', {
            lngs: LANG,
            intex: input
        }),
        inCX: mm('greet.inChan', {
            lngs: LANG,
            intex: input
        }),
        tellMsg: mm('greet.tellmeMSG', {
            lngs: LANG
        }),
        tellChn: mm('greet.tellmeCHN', {
            lngs: LANG
        })

    }


    if (args.length == 2 && args[0] === "time") {

        if (!isNaN(Number(args[1]))){
            let num = parseInt(args[1])
         gear.server.setDB(Server.id,{$set:{"modules.GREET.timer":num*1000}})
            return message.reply(mm('greet.timer', {
            lngs: LANG,
            timeMin: num
        }))
        }

    }



    if (args.length >= 2







        && args[0] === "msg") {
        if (args.length == 2) {
            return Channel.send(v.tellMsg);
        }
        let offset = MSG.indexOf("msg") + 3
         gear.serverDB.set(Server.id,{$set:{"modules.GREET.text": MSG.substr(offset)}})
         v.inTX = mm('greet.inTex', {
            lngs: LANG,
            wtxt: MSG.substr(offset)
        })
        return Channel.send(v.inTX);
    }
    if (args.length >= 2 && args[0] === "channel") {
        if (args.length == 2) {
            return Channel.send(v.tellChn);
        }
        let offset = MSG.indexOf("channel") + 7
        gear.serverDB.set(Server.id,{$set:{"modules.GREET.channel":message.mentions.channels.first().id}})
        return Channel.send(v.inCX);
    }



    if (Server.dDATA.modules.GREET.enabled === true) {
        gear.serverDB.set(Server.id,{$set:{"modules.GREET.enabled": false}})
        gear.serverDB.set(Server.id,{$set:{"modules.GREET.channel": ""}})
        return Channel.send(v.inOFF);

    } else {
        gear.serverDB.set(Server.id,{$set:{"modules.GREET.enabled": true}})
        gear.serverDB.set(Server.id,{$set:{"modules.GREET.channel": ""}})
        gear.serverDB.set(Server.id,{$set:{"modules.GREET.channel": message.channel.id}})
        return Channel.send(v.inON);
    }


}
module.exports = {
    pub: true,
    cmd: cmd,
    perms: 0,
    init: init,
    cat: 'mod'
};
