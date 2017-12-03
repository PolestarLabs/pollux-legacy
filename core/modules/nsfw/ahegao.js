var cmd = 'ahegao';
var gear = require("../../gearbox.js");

var paths = require("../../paths.json");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();

var init = function (message,userDB,DB) {
    var Server = message.guild;
    var Channel = message.channel;
    var LANG = message.lang;
    var MSG = message.content
    //-------MAGIC----------------





//HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
if (MSG.split(" ")[1]==helpkey || MSG.split(" ")[1]=="?"|| MSG.split(" ")[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------


    if(Server.dDATA.channels[Channel.id].modules.NSFW==false){
        message.reply(mm('forFun.nsfwNope',{lngs:LANG}));
        return;
    }



    var rand = gear.randomize(1,7)

    message.channel.send({files:[paths.BUILD+"ahegao/"+rand+".jpg"]})

};

 module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: 'nsfw'};


