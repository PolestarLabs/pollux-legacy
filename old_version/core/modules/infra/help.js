var gear = require("../../gearbox.js");
var fs = require("fs");
var paths = require("../../paths.js");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();


var cmd = 'help';

var init = function (message,userDB,DB) {
    var LANG = message.lang;


    try{

        let helpkey = mm("helpkey",{lngs:message.lang})
if (message.content.split(/ +/)[1]==helpkey || message.content.split(/ +/)[1]=="?"|| message.content.split(/ +/)[1]=="help"){


    let emb = new gear.Discord.RichEmbed
    emb.setDescription(mm('usage.askingHelpForHelp', {
                    lngs: LANG,

                    prefix: message.prefix,

                }))
    return  message.channel.send({embed:emb});
}

    }catch(e){gear.hook.send(e.error)}

        txt3 = `

**COMMAND LIST:** http://www.pollux.fun/commands


${mm('help.disableNuisance', {
                    lngs: LANG,

                    prefix: message.prefix,

                })}

${mm('help.invite', {
                    lngs: LANG,

                    prefix: message.prefix,

                })}: http://goo.gl/qkGqqU

${mm('help.joinSupp', {
                    lngs: LANG,

                    prefix: message.prefix,

                })}: https://discord.gg/ay48h7Q

`


            message.author.send(txt3.replace(/\$\{message\.prefix\}/g,message.prefix)).catch(e=> {let a = (new Error); gear.errLog(e,__filename,a.stack.toString())})


    //----Mess







    console.log("HELP INVOKED")
  //  message.reply(mm('help.checkYeDM',{lngs:LANG}))

let helpol = mm('help.polHelp', {lngs: LANG})
let heldesc = mm('help.helpText', {lngs: LANG})
let supserv = mm('help.supserv', {lngs: LANG})
let commlist = mm('help.commlist', {lngs: LANG})
let inviteme = mm('help.inviteme', {lngs: LANG})
let useful = mm('help.useful', {lngs: LANG})


let suplink     = "https://discord.gg/ay48h7Q"
let commlink    = "http://www.pollux.fun/commands"
let invitelink  = "http://goo.gl/qkGqqU"


 emb =    new gear.Discord.RichEmbed();



    emb.setTitle(helpol)
    emb.setColor("#eb4190")
    emb.setDescription(heldesc)
    emb.setThumbnail(message.botUser.user.avatarURL)
    emb.addField(":sos: "+supserv,suplink,false)
    emb.addField(":hash: "+commlist,commlink,false)
    emb.addField(":heart_decoration: "+inviteme,invitelink,false)
    emb.setFooter(useful+" +stats | +serverinfo | +logs | pollux+nuke | +invite")

  setTimeout(t=>message.channel.send({embed:emb}),1000)
};

 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 8,
    init: init,
    cat: 'help'
};
